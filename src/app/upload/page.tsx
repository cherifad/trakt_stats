'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileJson, CheckCircle, AlertCircle, Sparkles, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { hasUploadedData } from '@/lib/data';

type UploadStep = 'idle' | 'uploading' | 'validating' | 'processing' | 'success' | 'error';

export default function UploadPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadStep, setUploadStep] = useState<UploadStep>('idle');
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasExistingData, setHasExistingData] = useState(false);
    const [locale, setLocale] = useState<'en' | 'fr'>('fr');
    const router = useRouter();

    useEffect(() => {
        setHasExistingData(hasUploadedData());
        const savedLocale = localStorage.getItem('locale');
        if (savedLocale === 'en' || savedLocale === 'fr') {
            setLocale(savedLocale);
        }
    }, []);

    const handleClearData = () => {
        const confirmMessage = locale === 'fr'
            ? 'Es-tu sûr de vouloir supprimer tes données actuelles ?'
            : 'Are you sure you want to delete your current data?';

        if (confirm(confirmMessage)) {
            localStorage.removeItem('trakt_stats_data');
            setHasExistingData(false);
            setFile(null);
            setUploadStep('idle');
            setProgress(0);
        }
    };

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const validateFile = (file: File): boolean => {
        // Vérifier l'extension
        if (!file.name.endsWith('.json')) {
            setErrorMessage(locale === 'fr' ? 'Le fichier doit être au format JSON' : 'File must be in JSON format');
            setUploadStep('error');
            return false;
        }

        // Vérifier la taille (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            setErrorMessage(locale === 'fr' ? 'Le fichier est trop volumineux (max 50MB)' : 'File is too large (max 50MB)');
            setUploadStep('error');
            return false;
        }

        return true;
    };

    const validateJsonStructure = (data: any): boolean => {
        // Vérifier les champs essentiels
        const requiredFields = ['username', 'pfp', 'all_time_stats', 'movies', 'tv', 'trakt'];

        for (const field of requiredFields) {
            if (!data[field]) {
                setErrorMessage(
                    locale === 'fr'
                        ? `Champ manquant dans le fichier: ${field}`
                        : `Missing field in file: ${field}`
                );
                return false;
            }
        }

        // Vérifier la structure de all_time_stats
        const statsFields = ['plays', 'hours', 'collected', 'ratings', 'lists', 'comments'];
        for (const field of statsFields) {
            if (typeof data.all_time_stats[field] !== 'number') {
                setErrorMessage(
                    locale === 'fr'
                        ? `Données invalides dans all_time_stats.${field}`
                        : `Invalid data in all_time_stats.${field}`
                );
                return false;
            }
        }

        // Vérifier que movies et tv ont les bonnes structures
        if (!data.movies.users_top_10 || !data.tv.users_top_10) {
            setErrorMessage(
                locale === 'fr'
                    ? 'Structure de données movies/tv invalide'
                    : 'Invalid movies/tv data structure'
            );
            return false;
        }

        return true;
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && validateFile(droppedFile)) {
            setFile(droppedFile);
            processFile(droppedFile);
        }
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && validateFile(selectedFile)) {
            setFile(selectedFile);
            processFile(selectedFile);
        }
    }, []);

    const processFile = async (file: File) => {
        try {
            // Étape 1: Upload (simulation)
            setUploadStep('uploading');
            setProgress(0);
            await simulateProgress(0, 33, 500);

            // Étape 2: Validation
            setUploadStep('validating');
            const text = await file.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch (error) {
                setErrorMessage(
                    locale === 'fr'
                        ? 'Le fichier JSON est invalide ou corrompu'
                        : 'JSON file is invalid or corrupted'
                );
                setUploadStep('error');
                setFile(null);
                return;
            }

            await simulateProgress(33, 66, 500);

            // Vérifier la structure
            if (!validateJsonStructure(data)) {
                setUploadStep('error');
                setFile(null);
                return;
            }

            // Étape 3: Processing
            setUploadStep('processing');
            await simulateProgress(66, 100, 500);

            // Stocker dans localStorage
            localStorage.setItem('trakt_stats_data', text);

            setUploadStep('success');

            // Rediriger vers le dashboard
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (error) {
            console.error('Erreur lors du traitement:', error);
            setErrorMessage(
                locale === 'fr'
                    ? 'Erreur lors du traitement du fichier'
                    : 'Error processing file'
            );
            setUploadStep('error');
            setFile(null);
        }
    };

    const simulateProgress = (start: number, end: number, duration: number): Promise<void> => {
        return new Promise((resolve) => {
            const steps = 20;
            const increment = (end - start) / steps;
            const interval = duration / steps;
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                setProgress(Math.min(current, end));

                if (current >= end) {
                    clearInterval(timer);
                    resolve();
                }
            }, interval);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background gradient animé */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 animate-gradient opacity-20" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-block mb-4"
                    >
                        <div className="relative">
                            <Sparkles className="w-16 h-16 text-purple-500 animate-pulse" />
                            <div className="absolute inset-0 blur-2xl bg-purple-500/30 animate-pulse" />
                        </div>
                    </motion.div>
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Trakt Stats
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {locale === 'fr'
                            ? 'Découvre tes statistiques de visionnage détaillées'
                            : 'Discover your detailed viewing statistics'}
                    </p>
                    {hasExistingData && (
                        <div className="mt-4">
                            <Link href="/" className="text-purple-500 hover:underline font-medium">
                                {locale === 'fr' ? '← Retour au dashboard' : '← Back to dashboard'}
                            </Link>
                        </div>
                    )}
                </div>

                {hasExistingData && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <Card className="glass border-yellow-500/30 bg-yellow-500/5">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-sm">
                                        {locale === 'fr' ? 'Données déjà uploadées' : 'Data already uploaded'}
                                    </span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClearData}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {locale === 'fr'
                                        ? 'Supprimer et uploader un nouveau fichier'
                                        : 'Delete and upload a new file'}
                                </motion.button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                <Card className="glass border-white/10 overflow-hidden">
                    <CardContent className="p-8">
                        {/* Zone de drop - seulement visible en mode idle */}
                        {uploadStep === 'idle' && (
                            <div
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${isDragging
                                    ? 'border-purple-500 bg-purple-500/10 scale-105'
                                    : 'border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5'
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileInput}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    id="file-upload"
                                />

                                <motion.div
                                    animate={{ y: isDragging ? -10 : 0 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="text-center"
                                >
                                    <Upload className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        {isDragging
                                            ? (locale === 'fr' ? 'Dépose ton fichier ici' : 'Drop your file here')
                                            : (locale === 'fr' ? 'Upload ton fichier all-time-stats.json' : 'Upload your all-time-stats.json file')}
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        {locale === 'fr'
                                            ? 'Glisse-dépose ton fichier ou clique pour sélectionner'
                                            : 'Drag and drop your file or click to select'}
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-lg">
                                        <FileJson className="w-4 h-4" />
                                        {locale === 'fr' ? 'Format accepté: .json (max 50MB)' : 'Accepted format: .json (max 50MB)'}
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Progress UI - visible pendant upload/validation/processing/success */}
                        {(uploadStep === 'uploading' || uploadStep === 'validating' || uploadStep === 'processing' || uploadStep === 'success') && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="mb-6">
                                    {uploadStep === 'success' ? (
                                        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                                    ) : (
                                        <Loader2 className="w-16 h-16 mx-auto text-purple-500 animate-spin" />
                                    )}
                                </div>

                                <h3 className="text-2xl font-semibold mb-4">
                                    {uploadStep === 'uploading' && (locale === 'fr' ? 'Chargement du fichier...' : 'Uploading file...')}
                                    {uploadStep === 'validating' && (locale === 'fr' ? 'Vérification de la structure...' : 'Validating structure...')}
                                    {uploadStep === 'processing' && (locale === 'fr' ? 'Traitement des données...' : 'Processing data...')}
                                    {uploadStep === 'success' && (locale === 'fr' ? '✅ Fichier traité avec succès !' : '✅ File processed successfully!')}
                                </h3>

                                {/* Progress bar */}
                                <div className="max-w-md mx-auto mb-4">
                                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {Math.round(progress)}%
                                    </p>
                                </div>

                                {uploadStep === 'success' && (
                                    <p className="text-muted-foreground">
                                        {locale === 'fr' ? 'Redirection vers le dashboard...' : 'Redirecting to dashboard...'}
                                    </p>
                                )}
                            </motion.div>
                        )}

                        {/* Error UI */}
                        {uploadStep === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                                <h3 className="text-xl font-semibold mb-2 text-red-500">
                                    {locale === 'fr' ? 'Erreur lors du traitement' : 'Processing error'}
                                </h3>
                                <p className="text-muted-foreground mb-6">{errorMessage}</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setFile(null);
                                        setUploadStep('idle');
                                        setErrorMessage('');
                                        setProgress(0);
                                    }}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    {locale === 'fr' ? 'Réessayer' : 'Try again'}
                                </motion.button>
                            </motion.div>
                        )}

                        <div className="mt-8 text-center text-sm text-muted-foreground">
                            <p className="mb-2">
                                {locale === 'fr' ? 'Où trouver ton fichier ?' : 'Where to find your file?'}
                            </p>
                            <ol className="text-left max-w-md mx-auto space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 font-bold">1.</span>
                                    <span>
                                        {locale === 'fr' ? 'Connecte-toi sur ' : 'Log in to '}
                                        <a href="https://trakt.tv" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">
                                            trakt.tv
                                        </a>
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 font-bold">2.</span>
                                    <span>
                                        {locale === 'fr'
                                            ? 'Va dans Settings → Your Data → Export your data'
                                            : 'Go to Settings → Your Data → Export your data'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 font-bold">3.</span>
                                    <span>
                                        {locale === 'fr'
                                            ? 'Télécharge le fichier all-time-stats.json'
                                            : 'Download the all-time-stats.json file'}
                                    </span>
                                </li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}