// WordPress theme TypeScript starter
interface ThemeConfig {
  name: string;
  version: string;
  debug: boolean;
}

class ThemeBase {
  private config: ThemeConfig;

  constructor(config: ThemeConfig) {
    this.config = config;
    this.init();
  }

  private init(): void {
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', () => {
      // Example initialization logic
    });
  }
}

// Initialize the theme
const themeConfig: ThemeConfig = {
  name: 'Hello Elementor Child',
  version: '1.0.0',
  debug: true,
};

new ThemeBase(themeConfig);
