'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ChevronLeft,
    ChevronRight,
    Home,
    List,
    Settings,
    Languages,
    ZoomIn,
    ZoomOut,
    Maximize,
    Minimize,
    ArrowUp,
    Loader2,
    AlertCircle
} from 'lucide-react';
import chapterService from '@/lib/api/services/chapterService';
import { useToast } from '@/context/ToastContext';
import Skeleton from '@/components/ui/Skeleton';
import clsx from 'clsx';

// Reader Toolbar
function ReaderToolbar({
    comic,
    chapter,
    showTranslation,
    onToggleTranslation,
    translationAvailable,
    isTranslating,
    zoom,
    onZoomIn,
    onZoomOut,
    isFullscreen,
    onToggleFullscreen,
    onShowChapterList
}) {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-xl border-b border-[var(--border-primary)]">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
                {/* Left - Back & Title */}
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        href={`/comics/${comic?.slug}`}
                        className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        title="Kembali ke detail komik"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-sm font-medium text-[var(--text-primary)] truncate">
                            {comic?.title || 'Loading...'}
                        </h1>
                        <p className="text-xs text-[var(--text-tertiary)] truncate">
                            Chapter {chapter?.number} {chapter?.title && `- ${chapter.title}`}
                        </p>
                    </div>
                </div>

                {/* Right - Controls */}
                <div className="flex items-center gap-1">
                    {/* Translation Toggle */}
                    <button
                        onClick={onToggleTranslation}
                        disabled={!translationAvailable || isTranslating}
                        className={clsx(
                            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                            showTranslation
                                ? 'bg-[var(--primary-500)] text-white'
                                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]',
                            (!translationAvailable || isTranslating) && 'opacity-50 cursor-not-allowed'
                        )}
                        title={translationAvailable ? 'Toggle terjemahan Indonesia' : 'Terjemahan belum tersedia'}
                    >
                        {isTranslating ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Languages size={16} />
                        )}
                        <span className="hidden sm:inline">
                            {showTranslation ? 'ID' : 'Raw'}
                        </span>
                    </button>

                    {/* Zoom Controls */}
                    <div className="hidden sm:flex items-center border-l border-[var(--border-primary)] ml-2 pl-2">
                        <button
                            onClick={onZoomOut}
                            disabled={zoom <= 50}
                            className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] disabled:opacity-50"
                            title="Perkecil"
                        >
                            <ZoomOut size={18} />
                        </button>
                        <span className="text-xs text-[var(--text-tertiary)] w-12 text-center">{zoom}%</span>
                        <button
                            onClick={onZoomIn}
                            disabled={zoom >= 200}
                            className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] disabled:opacity-50"
                            title="Perbesar"
                        >
                            <ZoomIn size={18} />
                        </button>
                    </div>

                    {/* Fullscreen */}
                    <button
                        onClick={onToggleFullscreen}
                        className="hidden sm:flex p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                        title={isFullscreen ? 'Keluar fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>

                    {/* Chapter List */}
                    <button
                        onClick={onShowChapterList}
                        className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                        title="Daftar chapter"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Bottom Navigation
function ReaderNavigation({ prevChapter, nextChapter, comicSlug, currentNumber }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-xl border-t border-[var(--border-primary)]">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                {/* Prev Chapter */}
                {prevChapter ? (
                    <Link
                        href={`/comics/${comicSlug}/chapter/${prevChapter}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <ChevronLeft size={18} />
                        <span className="hidden sm:inline">Chapter {prevChapter}</span>
                        <span className="sm:hidden">Prev</span>
                    </Link>
                ) : (
                    <div className="px-4 py-2 text-[var(--text-tertiary)] opacity-50">
                        <ChevronLeft size={18} />
                    </div>
                )}

                {/* Current */}
                <span className="text-sm text-[var(--text-secondary)]">
                    Chapter {currentNumber}
                </span>

                {/* Next Chapter */}
                {nextChapter ? (
                    <Link
                        href={`/comics/${comicSlug}/chapter/${nextChapter}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <span className="hidden sm:inline">Chapter {nextChapter}</span>
                        <span className="sm:hidden">Next</span>
                        <ChevronRight size={18} />
                    </Link>
                ) : (
                    <div className="px-4 py-2 text-[var(--text-tertiary)] opacity-50">
                        <ChevronRight size={18} />
                    </div>
                )}
            </div>
        </div>
    );
}

// Page Image Component
function PageImage({ page, index, zoom, showTranslation }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    // Use the correct property names from API: original_image_url and translated_image_url
    const translatedSrc = page.translated_image_url || page.translated_image;
    const originalSrc = page.original_image_url || page.original_image;

    // Determine which image to show
    const imageSrc = showTranslation && translatedSrc ? translatedSrc : originalSrc;

    // Skip rendering if no valid image source
    if (!imageSrc) {
        return (
            <div
                className="relative flex justify-center"
                style={{ maxWidth: `${zoom}%`, margin: '0 auto' }}
            >
                <div className="flex flex-col items-center justify-center bg-[var(--bg-secondary)] rounded-lg p-8 min-h-[200px] w-full max-w-3xl">
                    <AlertCircle size={32} className="text-yellow-500 mb-2" />
                    <p className="text-[var(--text-secondary)] text-sm">Halaman {index + 1}: Gambar tidak tersedia</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative flex justify-center"
            style={{
                maxWidth: `${zoom}%`,
                margin: '0 auto'
            }}
        >
            {!loaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-secondary)] rounded-lg min-h-[400px]">
                    <div className="text-center">
                        <Loader2 size={32} className="animate-spin mx-auto mb-2 text-[var(--primary-500)]" />
                        <p className="text-sm text-[var(--text-tertiary)]">Memuat halaman {index + 1}...</p>
                    </div>
                </div>
            )}

            {error ? (
                <div className="flex flex-col items-center justify-center bg-[var(--bg-secondary)] rounded-lg p-8 min-h-[400px]">
                    <AlertCircle size={48} className="text-red-500 mb-4" />
                    <p className="text-[var(--text-secondary)]">Gagal memuat gambar</p>
                    <button
                        onClick={() => setError(false)}
                        className="mt-2 text-sm text-[var(--primary-500)] hover:underline"
                    >
                        Coba lagi
                    </button>
                </div>
            ) : (
                <Image
                    src={imageSrc}
                    alt={`Halaman ${index + 1}`}
                    width={page.width || 800}
                    height={page.height || 1200}
                    className={clsx(
                        'max-w-full h-auto transition-opacity duration-300',
                        loaded ? 'opacity-100' : 'opacity-0'
                    )}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    priority={index < 2}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    quality={index < 3 ? 85 : 75}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwEPwAB//9k="
                    unoptimized
                />
            )}

            {/* Page Number */}
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                {index + 1}
            </div>
        </div>
    );
}

// Chapter List Modal
function ChapterListModal({ isOpen, onClose, chapters, comicSlug, currentNumber }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[var(--bg-primary)] border-l border-[var(--border-primary)] shadow-xl overflow-y-auto animate-slide-left">
                <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-[var(--text-primary)]">Daftar Chapter</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-4 space-y-2">
                    {chapters?.map((ch) => (
                        <Link
                            key={ch.number}
                            href={`/comics/${comicSlug}/chapter/${ch.number}`}
                            onClick={onClose}
                            className={clsx(
                                'block px-4 py-3 rounded-lg transition-colors',
                                ch.number === currentNumber
                                    ? 'bg-[var(--primary-500)] text-white'
                                    : 'bg-[var(--bg-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)]'
                            )}
                        >
                            <span className="font-medium">Chapter {ch.number}</span>
                            {ch.title && ch.title !== `Chapter ${ch.number}` && (
                                <span className="text-sm opacity-80 ml-2">- {ch.title}</span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Scroll to Top Button
function ScrollToTop() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!show) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 z-40 p-3 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-full shadow-lg transition-all"
            aria-label="Scroll ke atas"
        >
            <ArrowUp size={20} />
        </button>
    );
}

// Main Chapter Reader Page
export default function ChapterReaderPage() {
    const params = useParams();
    const router = useRouter();
    const toast = useToast();

    const { slug: comicSlug, chapterNumber } = params;

    const [chapter, setChapter] = useState(null);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showTranslation, setShowTranslation] = useState(true); // Default show translation
    const [translationAvailable, setTranslationAvailable] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    const [zoom, setZoom] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showChapterList, setShowChapterList] = useState(false);

    // Build chapter slug from comic slug and chapter number
    const chapterSlug = `${comicSlug}-chapter-${chapterNumber}`;

    // Fetch chapter data
    useEffect(() => {
        async function fetchChapter() {
            setLoading(true);
            setError(null);
            try {
                const chapterData = await chapterService.getChapter(chapterSlug);
                setChapter(chapterData);

                // Check if translation is available
                const hasTranslation = chapterData.translation_status === 'completed';
                setTranslationAvailable(hasTranslation);
                setShowTranslation(hasTranslation);

            } catch (err) {
                console.error('Failed to fetch chapter:', err);
                setError(err.message || 'Gagal memuat chapter');
            } finally {
                setLoading(false);
            }
        }

        if (comicSlug && chapterNumber) {
            fetchChapter();
        }
    }, [comicSlug, chapterNumber, chapterSlug]);

    // Fetch pages
    useEffect(() => {
        async function fetchPages() {
            if (!chapter) return;

            setIsTranslating(true);
            try {
                const pagesData = await chapterService.getPages(chapterSlug, showTranslation);
                setPages(pagesData?.pages || pagesData || []);
            } catch (err) {
                console.error('Failed to fetch pages:', err);
                toast.error('Gagal memuat halaman');
            } finally {
                setIsTranslating(false);
            }
        }

        fetchPages();
    }, [chapter, showTranslation, chapterSlug, toast]);

    // Toggle translation
    const handleToggleTranslation = useCallback(() => {
        if (!translationAvailable) {
            toast.info('Terjemahan Indonesia belum tersedia untuk chapter ini');
            return;
        }
        setShowTranslation(prev => !prev);
    }, [translationAvailable, toast]);

    // Zoom controls
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

    // Fullscreen toggle
    const handleToggleFullscreen = useCallback(async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft' && chapter?.navigation?.prev) {
                router.push(`/comics/${comicSlug}/chapter/${chapter.navigation.prev}`);
            } else if (e.key === 'ArrowRight' && chapter?.navigation?.next) {
                router.push(`/comics/${comicSlug}/chapter/${chapter.navigation.next}`);
            } else if (e.key === 't' || e.key === 'T') {
                handleToggleTranslation();
            } else if (e.key === '+' || e.key === '=') {
                handleZoomIn();
            } else if (e.key === '-') {
                handleZoomOut();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [chapter, comicSlug, router, handleToggleTranslation]);

    // Parse navigation - ensure we get valid numbers
    const parseChapterNumber = (value) => {
        if (!value) return null;

        // If it's already a number, return it
        if (typeof value === 'number') return value;

        // If it's a string slug, parse it
        if (typeof value === 'string') {
            const parts = value.split('-chapter-');
            const num = parseFloat(parts[parts.length - 1]);
            return isNaN(num) ? null : num;
        }

        // If it's an object with a number property
        if (typeof value === 'object' && value.number) {
            return parseFloat(value.number);
        }

        return null;
    };

    const prevChapter = parseChapterNumber(chapter?.navigation?.prev);
    const nextChapter = parseChapterNumber(chapter?.navigation?.next);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)]">
                {/* Toolbar Skeleton */}
                <div className="h-14 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]" />

                {/* Pages Skeleton */}
                <div className="container mx-auto px-4 py-8 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="w-full max-w-3xl mx-auto aspect-[2/3]" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !chapter) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
                <div className="max-w-md w-full text-center">
                    <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Chapter Tidak Ditemukan
                    </h1>
                    <p className="text-[var(--text-secondary)] mb-6">
                        {error || 'Maaf, chapter yang Anda cari tidak tersedia.'}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link
                            href={`/comics/${comicSlug}`}
                            className="px-6 py-3 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-lg transition-colors"
                        >
                            Kembali ke Komik
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={clsx(
            'min-h-screen bg-[var(--bg-primary)]',
            isFullscreen && 'reader-fullscreen'
        )}>
            {/* Toolbar */}
            <ReaderToolbar
                comic={chapter.comic}
                chapter={chapter}
                showTranslation={showTranslation}
                onToggleTranslation={handleToggleTranslation}
                translationAvailable={translationAvailable}
                isTranslating={isTranslating}
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                isFullscreen={isFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
                onShowChapterList={() => setShowChapterList(true)}
            />

            {/* Translation Status Banner */}
            {!translationAvailable && (
                <div className="fixed top-14 left-0 right-0 z-40 bg-yellow-500/10 border-b border-yellow-500/20 py-2 text-center">
                    <p className="text-sm text-yellow-500">
                        <Languages size={14} className="inline mr-2" />
                        Terjemahan Indonesia belum tersedia untuk chapter ini
                    </p>
                </div>
            )}

            {/* Pages Container */}
            <div
                className={clsx(
                    'pt-20 pb-20 px-4',
                    !translationAvailable && 'pt-28'
                )}
            >
                <div className="space-y-2">
                    {pages.map((page, index) => (
                        <PageImage
                            key={page.uuid || index}
                            page={page}
                            index={index}
                            zoom={zoom}
                            showTranslation={showTranslation}
                        />
                    ))}
                </div>

                {/* End of Chapter */}
                {pages.length > 0 && (
                    <div className="max-w-3xl mx-auto mt-8 p-6 bg-[var(--bg-secondary)] rounded-xl text-center">
                        <p className="text-[var(--text-secondary)] mb-4">
                            — Akhir Chapter {chapterNumber} —
                        </p>
                        {nextChapter ? (
                            <Link
                                href={`/comics/${comicSlug}/chapter/${nextChapter}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-lg transition-colors"
                            >
                                Lanjut ke Chapter {nextChapter}
                                <ChevronRight size={18} />
                            </Link>
                        ) : (
                            <p className="text-[var(--text-tertiary)]">
                                Ini adalah chapter terakhir yang tersedia.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <ReaderNavigation
                prevChapter={prevChapter}
                nextChapter={nextChapter}
                comicSlug={comicSlug}
                currentNumber={parseInt(chapterNumber)}
            />

            {/* Scroll to Top */}
            <ScrollToTop />

            {/* Chapter List Modal */}
            <ChapterListModal
                isOpen={showChapterList}
                onClose={() => setShowChapterList(false)}
                chapters={chapter.comic?.chapters || []}
                comicSlug={comicSlug}
                currentNumber={parseInt(chapterNumber)}
            />
        </div>
    );
}
