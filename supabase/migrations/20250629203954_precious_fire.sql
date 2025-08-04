/*
  # Eliminar verificación de email completamente

  1. Configuración de auto-confirmación
    - Función para auto-confirmar usuarios nuevos
    - Trigger para aplicar auto-confirmación
    - Actualizar usuarios existentes sin confirmación

  2. Notas importantes
    - Evita actualizar columnas generadas como confirmed_at
    - Solo actualiza email_confirmed_at que es suficiente
    - Proporciona función de utilidad para casos especiales
*/

-- Función para auto-confirmar usuarios
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo auto-confirmar el email (confirmed_at se genera automáticamente)
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;

-- Crear trigger para auto-confirmar usuarios al registrarse
CREATE TRIGGER auto_confirm_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();

-- Actualizar usuarios existentes que no estén confirmados
-- Solo actualizamos email_confirmed_at, confirmed_at se actualiza automáticamente
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Función para confirmar usuario por email (útil para casos especiales)
CREATE OR REPLACE FUNCTION confirm_user_by_email(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE auth.users 
  SET email_confirmed_at = NOW()
  WHERE email = user_email AND email_confirmed_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Función para confirmar usuario por ID (alternativa)
CREATE OR REPLACE FUNCTION confirm_user_by_id(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE auth.users 
  SET email_confirmed_at = NOW()
  WHERE id = user_id AND email_confirmed_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;