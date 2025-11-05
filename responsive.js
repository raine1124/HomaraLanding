// ABOUTME: Responsive container manager for Homara landing page animation
// ABOUTME: Provides device-aware scaling and configuration for consistent cross-device experience

class ResponsiveManager {
    constructor() {
        this.device = null;
        this.scaleFactor = 1;
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        this.config = null;
        this.resizeTimeout = null;
        
        // Initialize on construction
        this.init();
    }

    init() {
        // Detect device and calculate initial configuration
        this.detectDevice();
        this.calculateScaleFactor();
        this.generateConfig();
        this.injectResponsiveStyles();
        
        // Set up resize handler with debouncing
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => this.handleResize());
    }

    detectDevice() {
        const width = window.innerWidth;
        
        if (width < 768) {
            this.device = 'mobile';
        } else if (width >= 768 && width < 1024) {
            this.device = 'tablet';
        } else {
            this.device = 'desktop';
        }
        
        return this.device;
    }

    calculateScaleFactor() {
        const width = this.viewportWidth;
        const height = this.viewportHeight;
        
        // Base design is for ~1920px width desktop
        const baseWidth = 1920;
        const baseHeight = 1080;
        
        // Calculate scale factor based on viewport
        const widthScale = width / baseWidth;
        const heightScale = height / baseHeight;
        
        // Use the smaller scale to ensure content fits
        this.scaleFactor = Math.min(widthScale, heightScale);
        
        // Apply device-specific constraints
        if (this.device === 'mobile') {
            // Mobile: ensure text doesn't get too small or too large
            this.scaleFactor = Math.max(0.25, Math.min(this.scaleFactor, 0.6));
        } else if (this.device === 'tablet') {
            this.scaleFactor = Math.max(0.5, Math.min(this.scaleFactor, 0.85));
        } else {
            // Desktop: allow more flexibility
            this.scaleFactor = Math.max(0.7, Math.min(this.scaleFactor, 1.2));
        }
        
        return this.scaleFactor;
    }

    generateConfig() {
        // Base configuration values (desktop)
        const baseConfig = {
            fontSize: 7, // rem
            letterSpacing: 5, // px
            textPointCount: 1200,
            starfieldPointCount: 1000,
            perspective: 800, // px
            canvasFontSize: '7rem',
            mainH1Size: 48, // px
            mainH2Size: 24, // px
            containerPadding: 40, // px
        };

        // Apply scaling and device-specific adjustments
        this.config = {
            // Animation text sizing
            fontSize: this.getResponsiveFontSize(baseConfig.fontSize),
            letterSpacing: this.getResponsiveLetterSpacing(baseConfig.letterSpacing),
            canvasFontSize: this.getCanvasFontSize(baseConfig.fontSize),
            
            // Performance optimizations for mobile
            textPointCount: this.getPointCount(baseConfig.textPointCount),
            starfieldPointCount: this.getStarfieldCount(baseConfig.starfieldPointCount),
            
            // 3D perspective adjustments
            perspective: this.getPerspective(baseConfig.perspective),
            
            // Main content sizing
            mainH1Size: this.getMainH1Size(baseConfig.mainH1Size),
            mainH2Size: this.getMainH2Size(baseConfig.mainH2Size),
            containerPadding: this.getContainerPadding(baseConfig.containerPadding),
            
            // Device info
            device: this.device,
            scaleFactor: this.scaleFactor,
            viewportWidth: this.viewportWidth,
            viewportHeight: this.viewportHeight,
        };

        return this.config;
    }

    getResponsiveFontSize(baseFontSize) {
        // Calculate responsive font size in rem
        let fontSize = baseFontSize * this.scaleFactor;
        
        // Device-specific adjustments
        if (this.device === 'mobile') {
            // Ensure readable size on mobile (2.5rem to 4rem range)
            fontSize = Math.max(2.5, Math.min(fontSize, 4));
        } else if (this.device === 'tablet') {
            fontSize = Math.max(4, Math.min(fontSize, 6));
        }
        
        return fontSize;
    }

    getResponsiveLetterSpacing(baseSpacing) {
        let spacing = baseSpacing * this.scaleFactor;
        
        if (this.device === 'mobile') {
            // Tighter spacing on mobile
            spacing = Math.max(2, Math.min(spacing, 4));
        } else if (this.device === 'tablet') {
            spacing = Math.max(3, Math.min(spacing, 5));
        }
        
        return spacing;
    }

    getCanvasFontSize(baseFontSize) {
        const fontSize = this.getResponsiveFontSize(baseFontSize);
        return `bold ${fontSize}rem Arial`;
    }

    getPointCount(baseCount) {
        // Reduce particle count on mobile for better performance
        if (this.device === 'mobile') {
            return Math.floor(baseCount * 0.4); // 40% of desktop
        } else if (this.device === 'tablet') {
            return Math.floor(baseCount * 0.7); // 70% of desktop
        }
        return baseCount;
    }

    getStarfieldCount(baseCount) {
        // Reduce starfield density on mobile
        if (this.device === 'mobile') {
            return Math.floor(baseCount * 0.3); // 30% of desktop
        } else if (this.device === 'tablet') {
            return Math.floor(baseCount * 0.6); // 60% of desktop
        }
        return baseCount;
    }

    getPerspective(basePerspective) {
        // Adjust 3D perspective based on viewport
        let perspective = basePerspective * this.scaleFactor;
        
        if (this.device === 'mobile') {
            // Shallower perspective on mobile for better visibility
            perspective = Math.max(400, Math.min(perspective, 600));
        } else if (this.device === 'tablet') {
            perspective = Math.max(600, Math.min(perspective, 800));
        }
        
        return perspective;
    }

    getMainH1Size(baseSize) {
        let size = baseSize * this.scaleFactor;
        
        if (this.device === 'mobile') {
            size = Math.max(28, Math.min(size, 36));
        } else if (this.device === 'tablet') {
            size = Math.max(36, Math.min(size, 44));
        }
        
        return size;
    }

    getMainH2Size(baseSize) {
        let size = baseSize * this.scaleFactor;
        
        if (this.device === 'mobile') {
            size = Math.max(16, Math.min(size, 20));
        } else if (this.device === 'tablet') {
            size = Math.max(20, Math.min(size, 24));
        }
        
        return size;
    }

    getContainerPadding(basePadding) {
        if (this.device === 'mobile') {
            return 20;
        } else if (this.device === 'tablet') {
            return 30;
        }
        return basePadding;
    }

    injectResponsiveStyles() {
        // Create or update style element for responsive CSS
        let styleElement = document.getElementById('responsive-styles');
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'responsive-styles';
            document.head.appendChild(styleElement);
        }

        // Generate responsive CSS
        const css = `
            /* Responsive adjustments for main content */
            @media (max-width: 767px) {
                .container {
                    padding: ${this.config.containerPadding}px 15px !important;
                    max-width: 100% !important;
                }

                .logo {
                    max-width: 200px !important;
                    margin-bottom: 20px !important;
                }

                .container h2 {
                    font-size: ${this.config.mainH2Size}px !important;
                    margin-bottom: 30px !important;
                    line-height: 1.4 !important;
                }
                
                .input-container {
                    flex-direction: column !important;
                }
                
                #email-input {
                    border-radius: 4px !important;
                    margin-bottom: 10px !important;
                    width: 100% !important;
                }
                
                #submit-btn {
                    border-radius: 4px !important;
                    width: 100% !important;
                    padding: 14px 20px !important;
                }
            }
            
            @media (min-width: 768px) and (max-width: 1023px) {
                .container {
                    padding: ${this.config.containerPadding}px 25px !important;
                }

                .logo {
                    max-width: 250px !important;
                    margin-bottom: 25px !important;
                }

                .container h2 {
                    font-size: ${this.config.mainH2Size}px !important;
                }
            }
            
            /* Ensure viewport doesn't zoom on input focus (iOS) */
            @media (max-width: 767px) {
                input[type="email"] {
                    font-size: 16px !important;
                }
            }
        `;

        styleElement.textContent = css;
    }

    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        
        this.resizeTimeout = setTimeout(() => {
            // Update viewport dimensions
            this.viewportWidth = window.innerWidth;
            this.viewportHeight = window.innerHeight;
            
            // Recalculate device and config
            const oldDevice = this.device;
            this.detectDevice();
            this.calculateScaleFactor();
            this.generateConfig();
            this.injectResponsiveStyles();
            
            // Dispatch custom event if device type changed
            if (oldDevice !== this.device) {
                window.dispatchEvent(new CustomEvent('devicechange', {
                    detail: { device: this.device, config: this.config }
                }));
            }
        }, 250);
    }

    getConfig() {
        return this.config;
    }

    getDevice() {
        return this.device;
    }

    getScaleFactor() {
        return this.scaleFactor;
    }
}

// Create global instance
window.responsiveManager = new ResponsiveManager();

