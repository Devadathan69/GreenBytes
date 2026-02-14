import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, realtimeDb } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, setDoc, getDocs } from 'firebase/firestore';
import { ref, onValue, off } from 'firebase/database';
import { sendWaterCloggingAlert, clearCloggingAlert } from '../services/notificationService';

const CropContext = createContext();

export const useCrop = () => useContext(CropContext);

// Crop theme mapping
const CROP_THEMES = {
    cardamom: 'cardamom',
    tomato: 'tomato',
    chilli: 'chilli',
};

export const CropProvider = ({ children }) => {
    const [crops, setCrops] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [zones, setZones] = useState([]);
    const [soilReports, setSoilReports] = useState([]);
    const [diseaseResults, setDiseaseResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [sensorData, setSensorData] = useState({}); // { moduleId: { moisturePercent, moistureValue, waterLogging } }

    // Apply theme based on crop
    const applyTheme = useCallback((cropName) => {
        const key = cropName?.toLowerCase() || '';
        const theme = CROP_THEMES[key] || 'cardamom';
        document.documentElement.setAttribute('data-crop', theme);
    }, []);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Load crops when user changes — always from Firestore
    useEffect(() => {
        if (!currentUser) { setCrops([]); setLoading(false); return; }

        const q = query(collection(db, `users/${currentUser.uid}/crops`));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setCrops(data);
            if (data.length > 0 && !selectedCrop) {
                setSelectedCrop(data[0]);
                applyTheme(data[0].name);
            }
            setLoading(false);
        }, (err) => {
            console.error("Firestore crops error:", err);
            setLoading(false);
        });
        return () => unsub();
    }, [currentUser]);

    // Load zones when selectedCrop changes — always from Firestore
    useEffect(() => {
        if (!currentUser || !selectedCrop) { setZones([]); return; }

        const q = query(collection(db, `users/${currentUser.uid}/crops/${selectedCrop.id}/zones`));
        const unsub = onSnapshot(q, (snap) => {
            setZones(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (err) => {
            console.error("Firestore zones error:", err);
        });
        return () => unsub();
    }, [currentUser, selectedCrop]);



    // Listen to RTDB sensor data for all modules assigned to current zones
    useEffect(() => {
        if (zones.length === 0) { setSensorData({}); return; }

        // Collect unique moduleIds from zones
        const moduleIds = [...new Set(zones.map(z => z.moduleId).filter(Boolean))];
        const listeners = [];

        // Timers for sustained moisture threshold (moisturePercent > 15 for 10s)
        const moistureTimers = {};

        // Map from onboarding module name to RTDB path
        const MODULE_TO_RTDB = {
            'Module 1': 'farm1',
            'Module 2': 'farm2',
            'Module 3': 'farm3',
            'Module 4': 'farm4',
            'Module 5': 'farm5',
        };

        moduleIds.forEach(moduleId => {
            const rtdbPath = MODULE_TO_RTDB[moduleId] || moduleId;
            const sensorRef = ref(realtimeDb, rtdbPath);
            const listener = onValue(sensorRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const moisturePct = data.moisturePercent ?? 0;
                    const isAboveThreshold = moisturePct > 15;

                    if (isAboveThreshold && !moistureTimers[moduleId]) {
                        // Start 10-second timer
                        moistureTimers[moduleId] = setTimeout(() => {
                            setSensorData(prev => ({
                                ...prev,
                                [moduleId]: {
                                    ...prev[moduleId],
                                    waterLogging: true,
                                }
                            }));

                            // Trigger Email Notification
                            const zone = zones.find(z => z.moduleId === moduleId);
                            if (zone) {
                                sendWaterCloggingAlert({
                                    zoneName: zone.name,
                                    cropName: selectedCrop?.name || 'Unknown Crop',
                                    moduleId: moduleId,
                                    moisturePercent: moisturePct,
                                    moistureValue: data.moistureValue
                                });
                            }
                        }, 10000);
                    } else if (!isAboveThreshold) {
                        // Clear timer and reset warning
                        if (moistureTimers[moduleId]) {
                            clearTimeout(moistureTimers[moduleId]);
                            moistureTimers[moduleId] = null;
                        }
                        // Reset notification state so it can fire again next time
                        clearCloggingAlert(moduleId);
                    }

                    setSensorData(prev => ({
                        ...prev,
                        [moduleId]: {
                            moisturePercent: moisturePct,
                            moistureValue: data.moistureValue ?? null,
                            // Keep existing waterLogging state (managed by timer above)
                            waterLogging: isAboveThreshold ? (prev[moduleId]?.waterLogging ?? false) : false,
                            connected: true,
                            lastUpdated: new Date().toLocaleTimeString()
                        }
                    }));
                } else {
                    setSensorData(prev => ({
                        ...prev,
                        [moduleId]: { connected: false }
                    }));
                }
            }, (err) => {
                console.error(`RTDB error for ${moduleId}:`, err);
                setSensorData(prev => ({
                    ...prev,
                    [moduleId]: { connected: false, error: err.message }
                }));
            });

            listeners.push({ moduleId, sensorRef });
        });

        return () => {
            listeners.forEach(({ sensorRef }) => off(sensorRef));
            // Clear all pending timers
            Object.values(moistureTimers).forEach(t => t && clearTimeout(t));
        };
    }, [zones, selectedCrop]); // Added selectedCrop dependency for notification context

    // Load soil reports when selectedCrop changes
    useEffect(() => {
        if (!currentUser || !selectedCrop) { setSoilReports([]); return; }

        const q = query(collection(db, `users/${currentUser.uid}/crops/${selectedCrop.id}/soilReports`));
        const unsub = onSnapshot(q, (snap) => {
            setSoilReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (err) => {
            console.error("Firestore soil error:", err);
        });
        return () => unsub();
    }, [currentUser, selectedCrop]);

    // Select a crop by ID
    const selectCrop = useCallback((cropId) => {
        const c = crops.find(cr => cr.id === cropId);
        if (c) {
            setSelectedCrop(c);
            applyTheme(c.name);
        }
    }, [crops, applyTheme]);

    // Add a new crop + its zones to Firestore
    const addNewCrop = useCallback(async (cropData) => {
        if (!currentUser) return null;

        try {
            // Check for duplicates
            const existingSnap = await getDocs(collection(db, `users/${currentUser.uid}/crops`));
            const existing = existingSnap.docs.find(d => d.data().name === cropData.name);
            if (existing) return existing.id;

            // Create crop doc
            const cropRef = await addDoc(collection(db, `users/${currentUser.uid}/crops`), {
                name: cropData.name,
                icon: cropData.icon,
                variety: cropData.variety || 'Standard',
                createdAt: serverTimestamp()
            });

            // Create zone subcollection
            const zonesToCreate = cropData.zones || [{ name: 'Zone 1', moduleId: '' }];
            for (let i = 0; i < zonesToCreate.length; i++) {
                const z = zonesToCreate[i];
                await addDoc(collection(db, `users/${currentUser.uid}/crops/${cropRef.id}/zones`), {
                    name: z.name || `Zone ${i + 1}`,
                    moduleId: z.moduleId || '',
                    healthStatus: 'Good',
                    sensorData: {},
                    createdAt: serverTimestamp()
                });
            }

            return cropRef.id;
        } catch (err) {
            console.error("Error adding crop:", err);
            return null;
        }
    }, [currentUser]);

    // Add soil report to Firestore
    const addSoilReport = useCallback(async (reportData) => {
        if (!currentUser || !selectedCrop) return;
        try {
            await addDoc(collection(db, `users/${currentUser.uid}/crops/${selectedCrop.id}/soilReports`), {
                ...reportData,
                uploadedAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Error adding soil report:", err);
        }
    }, [currentUser, selectedCrop]);

    // Refresh — re-read user from localStorage and re-trigger effects
    const refreshAllData = useCallback(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        setLoading(true);
        setCurrentUser(user);
    }, []);

    const value = {
        crops,
        selectedCrop,
        selectCrop,
        zones,
        soilReports,
        sensorData,
        diseaseResults,
        loading,
        currentUser,
        addNewCrop,
        addSoilReport,
        refreshAllData,
        applyTheme,
    };

    return <CropContext.Provider value={value}>{children}</CropContext.Provider>;
};
