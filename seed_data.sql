DO $$
DECLARE
    v_torneo_id UUID;
    v_categoria_id UUID;
    v_equipo1_id UUID;
    v_equipo2_id UUID;
    v_equipo3_id UUID;
    v_equipo4_id UUID;
    v_partido1_id UUID;
    v_partido2_id UUID;
BEGIN
    -- 1. Obtener o Crear Categoría
    SELECT id INTO v_categoria_id FROM categorias LIMIT 1;
    
    IF v_categoria_id IS NULL THEN
        INSERT INTO categorias (nombre, costo_inscripcion, multa_amarilla, multa_roja)
        VALUES ('Libre Masculino', 100.00, 5.00, 10.00)
        RETURNING id INTO v_categoria_id;
        RAISE NOTICE 'Categoría creada: %', v_categoria_id;
    END IF;

    -- 2. Obtener o Crear Torneo
    SELECT id INTO v_torneo_id FROM torneos WHERE activo = true LIMIT 1;

    IF v_torneo_id IS NULL THEN
        INSERT INTO torneos (nombre, categoria_id, fecha_inicio, tiene_fase_grupos, tiene_eliminacion_directa, activo)
        VALUES ('Torneo Apertura 2025', v_categoria_id, NOW(), true, true, true)
        RETURNING id INTO v_torneo_id;
        RAISE NOTICE 'Torneo creado: %', v_torneo_id;
    ELSE
        RAISE NOTICE 'Usando Torneo existente: %', v_torneo_id;
    END IF;

    -- 3. Insertar Equipos
    INSERT INTO equipos (nombre, torneo_id, categoria_id, nivel, color_principal, activo)
    VALUES ('Los Rayos FC', v_torneo_id, v_categoria_id, '3', '#FFD700', true)
    RETURNING id INTO v_equipo1_id;

    INSERT INTO equipos (nombre, torneo_id, categoria_id, nivel, color_principal, activo)
    VALUES ('Atlético Norte', v_torneo_id, v_categoria_id, '3', '#FF0000', true)
    RETURNING id INTO v_equipo2_id;

    INSERT INTO equipos (nombre, torneo_id, categoria_id, nivel, color_principal, activo)
    VALUES ('Deportivo Sur', v_torneo_id, v_categoria_id, '3', '#0000FF', true)
    RETURNING id INTO v_equipo3_id;

    INSERT INTO equipos (nombre, torneo_id, categoria_id, nivel, color_principal, activo)
    VALUES ('Huracanes', v_torneo_id, v_categoria_id, '3', '#00FF00', true)
    RETURNING id INTO v_equipo4_id;

    -- 4. Insertar Partidos (ayer y hoy)
    INSERT INTO partidos (torneo_id, equipo_1_id, equipo_2_id, fecha, cancha, completado)
    VALUES (v_torneo_id, v_equipo1_id, v_equipo2_id, NOW() - INTERVAL '1 day', 'Cancha 1', false)
    RETURNING id INTO v_partido1_id;

    INSERT INTO partidos (torneo_id, equipo_1_id, equipo_2_id, fecha, cancha, completado)
    VALUES (v_torneo_id, v_equipo3_id, v_equipo4_id, NOW() - INTERVAL '1 day', 'Cancha 2', false)
    RETURNING id INTO v_partido2_id;

    INSERT INTO partidos (torneo_id, equipo_1_id, equipo_2_id, fecha, cancha, completado)
    VALUES (v_torneo_id, v_equipo1_id, v_equipo3_id, NOW() + INTERVAL '1 day', 'Cancha 1', false);

    -- 5. Finalizar Partidos (esto disparará los triggers de estadísticas)
    -- Partido 1: 3-1
    UPDATE partidos
    SET 
        goles_equipo_1 = 3,
        goles_equipo_2 = 1,
        completado = true
    WHERE id = v_partido1_id;

    -- Partido 2: 2-2
    UPDATE partidos
    SET 
        goles_equipo_1 = 2,
        goles_equipo_2 = 2,
        completado = true
    WHERE id = v_partido2_id;

    RAISE NOTICE 'Datos de prueba generados exitosamente.';
END $$;
