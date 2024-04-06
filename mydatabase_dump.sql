--
-- PostgreSQL database dump
--

-- Dumped from database version 14.11 (Ubuntu 14.11-1.pgdg22.04+1)
-- Dumped by pg_dump version 14.11 (Ubuntu 14.11-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: schedule; Type: TABLE; Schema: public; Owner: denis
--

CREATE TABLE public.schedule (
    pairnumber integer,
    subject text,
    auditorium text,
    starttimefirsthalf time without time zone,
    endtimefirsthalf time without time zone,
    breaktimeafterfirsthalf text,
    starttimesecondhalf time without time zone,
    endtimesecondhalf time without time zone,
    breaktimeaftersecondhalf text,
    dayofweek text
);


ALTER TABLE public.schedule OWNER TO denis;

--
-- Data for Name: schedule; Type: TABLE DATA; Schema: public; Owner: denis
--

COPY public.schedule (pairnumber, subject, auditorium, starttimefirsthalf, endtimefirsthalf, breaktimeafterfirsthalf, starttimesecondhalf, endtimesecondhalf, breaktimeaftersecondhalf, dayofweek) FROM stdin;
1	Стандарты ИКТ	224 Аудитория	09:00:00	09:45:00	5 мин	09:50:00	10:35:00	10 мин	Monday
2	Стандарты ИКТ	224 Аудитория	10:45:00	11:30:00	5 мин	11:35:00	12:20:00	40 мин	Monday
3	Теория автоматов и формальных языков	304 Аудитория	13:00:00	13:45:00	5 мин	13:50:00	14:35:00	10 мин	Monday
4	Теория автоматов и формальных языков	304 Аудитория	14:45:00	15:30:00	5 мин	15:35:00	16:20:00	5 мин	Monday
3	Математическая статистика	304 Аудитория	13:00:00	13:45:00	5 мин	13:50:00	14:35:00	10 мин	Tuesday
4	Математическая статистика	304 Аудитория	14:45:00	15:30:00	5 мин	15:35:00	16:20:00	5 мин	Tuesday
1	Web-программирование на JavaScript	309 Аудитория	09:00:00	09:45:00	5 мин	09:50:00	10:35:00	10 мин	Wednesday
2	Web-программирование на JavaScript	309 Аудитория	10:45:00	11:30:00	5 мин	11:35:00	12:20:00	40 мин	Wednesday
1	Функциональный анализ	303 Аудитория	09:00:00	09:45:00	5 мин	09:50:00	10:35:00	10 мин	Thursday
2	Функциональный анализ	303 Аудитория	10:45:00	11:30:00	5 мин	11:35:00	12:20:00	40 мин	Thursday
3	Базы данных	310 Аудитория	13:00:00	13:45:00	5 мин	13:50:00	14:35:00	10 мин	Saturday
4	Базы данных	310 Аудитория	14:45:00	15:30:00	5 мин	15:35:00	16:20:00	5 мин	Saturday
\.


--
-- PostgreSQL database dump complete
--

