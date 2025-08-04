/*
  # Configuración para registro instantáneo sin confirmación

  1. Configuración de autenticación
    - Deshabilitar confirmación de email
    - Habilitar auto-confirmación de usuarios
    - Configurar Google OAuth

  2. Notas importantes
    - Esta migración documenta los cambios necesarios
    - Los cambios reales deben hacerse en el Dashboard de Supabase
*/

-- Esta migración documenta la configuración necesaria en Supabase Dashboard:

-- 1. Authentication > Settings:
--    - Enable email confirmations: OFF
--    - Enable auto-confirm users: ON
--    - Enable signup: ON

-- 2. Authentication > Providers:
--    - Google: Enabled
--    - Configurar Client ID y Client Secret de Google

-- 3. Authentication > URL Configuration:
--    - Site URL: tu-dominio.com
--    - Redirect URLs: tu-dominio.com/**

-- Función para auto-confirmar usuarios (si es necesario)
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirmar el email del usuario
  NEW.email_confirmed_at = NOW();
  NEW.confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-confirmar usuarios al registrarse
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;
CREATE TRIGGER auto_confirm_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();