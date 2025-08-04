// 🔒 COPYRIGHT PROTECTION UTILITIES
// Sistema de protección de derechos de autor para Sigma AI

export class CopyrightProtection {
  private static readonly COPYRIGHT_NOTICE = '© 2025 Sigma AI. Todos los derechos reservados.';
  private static readonly BRAND_NAME = 'Sigma AI™';
  private static readonly LEGAL_EMAIL = 'legal@sigma-ai.app';
  
  // Verificar integridad del copyright
  static verifyCopyrightIntegrity(): boolean {
    try {
      // Verificar que los elementos de copyright estén presentes
      const hasFooter = document.querySelector('footer');
      const hasCopyrightText = document.body.innerText.includes('© 2025 Sigma AI');
      const hasProtectionNotice = document.body.innerText.includes('Protegido');
      
      return hasFooter && hasCopyrightText && hasProtectionNotice;
    } catch (error) {
      console.warn('Error verificando copyright:', error);
      return false;
    }
  }
  
  // Detectar intentos de manipulación
  static detectTampering(): void {
    // Detectar herramientas de desarrollo abiertas
    let devtools = {
      open: false,
      orientation: null as string | null
    };
    
    const threshold = 160;
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          console.warn('🚨 AVISO LEGAL: Este software está protegido por derechos de autor.');
          console.warn('📜 La ingeniería inversa está prohibida.');
          console.warn('⚖️ Contacto legal: legal@sigma-ai.app');
        }
      } else {
        devtools.open = false;
      }
    }, 500);
    
    // Detectar intentos de copia del código
    document.addEventListener('keydown', (e) => {
      // Detectar Ctrl+U (ver código fuente)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        this.showCopyrightWarning();
      }
      
      // Detectar F12 (herramientas de desarrollo)
      if (e.key === 'F12') {
        e.preventDefault();
        this.showCopyrightWarning();
      }
      
      // Detectar Ctrl+Shift+I (inspector)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        this.showCopyrightWarning();
      }
    });
    
    // Detectar clic derecho
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showCopyrightWarning();
    });
  }
  
  // Mostrar advertencia de copyright
  private static showCopyrightWarning(): void {
    const warning = `
🚨 AVISO LEGAL - SIGMA AI

Este software está protegido por derechos de autor internacionales.

PROHIBIDO:
• Copiar el código fuente
• Ingeniería inversa
• Distribución no autorizada
• Uso comercial sin licencia

CONSECUENCIAS LEGALES:
• Acciones civiles por daños
• Órdenes judiciales
• Compensación monetaria
• Costos legales

Contacto legal: ${this.LEGAL_EMAIL}

© 2025 Sigma AI. Todos los derechos reservados.
    `;
    
    alert(warning);
  }
  
  // Inyectar marcas de agua en el código
  static injectWatermarks(): void {
    // Agregar comentarios de copyright en el DOM
    const watermark = document.createComment(`
      SIGMA AI - COPYRIGHT PROTECTED SOFTWARE
      © 2025 Sigma AI. All rights reserved.
      Unauthorized copying, distribution, or reverse engineering is prohibited.
      Legal contact: ${this.LEGAL_EMAIL}
    `);
    
    document.head.appendChild(watermark);
    
    // Agregar metadatos de copyright
    const copyrightMeta = document.createElement('meta');
    copyrightMeta.name = 'copyright';
    copyrightMeta.content = this.COPYRIGHT_NOTICE;
    document.head.appendChild(copyrightMeta);
    
    const authorMeta = document.createElement('meta');
    authorMeta.name = 'author';
    authorMeta.content = 'Sigma AI Team';
    document.head.appendChild(authorMeta);
  }
  
  // Generar reporte de violación
  static generateViolationReport(violationType: string): void {
    const report = {
      timestamp: new Date().toISOString(),
      violationType,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      platform: navigator.platform
    };
    
    console.warn('🚨 VIOLATION DETECTED:', report);
    
    // En producción, enviar reporte a servidor legal
    if (import.meta.env.PROD) {
      fetch('/api/legal/violation-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      }).catch(() => {
        // Silenciar errores de red
      });
    }
  }
  
  // Obtener información de copyright
  static getCopyrightInfo(): object {
    return {
      notice: this.COPYRIGHT_NOTICE,
      brand: this.BRAND_NAME,
      year: '2025',
      owner: 'Sigma AI',
      legalContact: this.LEGAL_EMAIL,
      licensingContact: 'licensing@sigma-ai.app',
      protectionLevel: 'MAXIMUM',
      jurisdiction: 'International',
      lastUpdated: new Date().toISOString()
    };
  }
}

// Inicializar protección al cargar
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    CopyrightProtection.injectWatermarks();
    CopyrightProtection.detectTampering();
    
    // Verificar integridad cada 30 segundos
    setInterval(() => {
      if (!CopyrightProtection.verifyCopyrightIntegrity()) {
        CopyrightProtection.generateViolationReport('COPYRIGHT_TAMPERING');
      }
    }, 30000);
  });
}

export default CopyrightProtection;