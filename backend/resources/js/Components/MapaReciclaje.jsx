import { useEffect, useRef, useState } from "react";

export default function MapaReciclaje({ onLocationSelect }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    const [loadingGeo, setLoadingGeo] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [hasLocation, setHasLocation] = useState(false);

    const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const DEFAULT_CENTER = { lat: -17.3895, lng: -66.1568 };

    useEffect(() => {
        if (!GOOGLE_MAPS_KEY) {
            console.error("❌ Google Maps KEY no cargó desde Vite.");
            setErrorMsg("Error al cargar el mapa. API KEY no encontrada.");
            return;
        }

        const loadMap = () => {
            const map = new window.google.maps.Map(mapRef.current, {
                center: DEFAULT_CENTER,
                zoom: 14,
                mapTypeId: "hybrid",
                disableDefaultUI: true,
                zoomControl: true,
                fullscreenControl: true,
                styles: [
                    { featureType: "poi", stylers: [{ visibility: "off" }] },
                    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] }
                ],
            });
            mapInstanceRef.current = map;

            map.addListener("click", (e) => placeMarkerAndNotify(e.latLng));
        };

        // Si Google Maps aún no está cargado, cargamos el script
        if (!window.google) {
            const script = document.createElement("script");
            script.src =
                `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = loadMap;
            document.head.appendChild(script);
        } else {
            loadMap();
        }

    }, [GOOGLE_MAPS_KEY]);

    const placeMarkerAndNotify = (latLng) => {
        if (!mapInstanceRef.current) return;

        if (markerRef.current) {
            markerRef.current.setPosition(latLng);
        } else {
            markerRef.current = new window.google.maps.Marker({
                position: latLng,
                map: mapInstanceRef.current,
                icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                animation: window.google.maps.Animation.DROP,
            });
        }

        setHasLocation(true);
        mapInstanceRef.current.panTo(latLng);

        onLocationSelect({
            latitud: latLng.lat(),
            longitud: latLng.lng(),
        });
    };

    const usarMiUbicacion = () => {
        if (!navigator.geolocation) {
            setErrorMsg("Tu navegador no soporta geolocalización.");
            return;
        }

        setLoadingGeo(true);
        setErrorMsg(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLoadingGeo(false);
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const latLng = new window.google.maps.LatLng(lat, lng);

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setZoom(17);
                    placeMarkerAndNotify(latLng);
                }
            },
            (err) => {
                setLoadingGeo(false);
                const errors = {
                    1: "🚫 Permiso denegado.",
                    2: "📡 Ubicación no disponible.",
                    3: "⏳ Tiempo de espera agotado.",
                };
                setErrorMsg(errors[err.code] || "❌ Error al obtener la ubicación.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <div className="relative">
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                <button
                    type="button"
                    onClick={usarMiUbicacion}
                    disabled={loadingGeo}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm shadow-md"
                >
                    {loadingGeo ? "Buscando..." : "📍 Usar mi ubicación"}
                </button>

                {hasLocation && (
                    <button
                        type="button"
                        onClick={() =>
                            mapInstanceRef.current?.panTo(markerRef.current.getPosition())
                        }
                        className="px-4 py-2 rounded-lg bg-white text-gray-700 border text-sm"
                    >
                        🔁 Centrar marcador
                    </button>
                )}
            </div>

            {errorMsg && (
                <div className="absolute top-3 right-3 z-10 bg-white border border-red-300 text-red-600 rounded-md px-4 py-2 shadow-md text-sm">
                    {errorMsg}
                </div>
            )}

            <div
                ref={mapRef}
                className="w-full h-[360px] rounded-2xl overflow-hidden border border-green-400/40 shadow-lg"
            />

            <div className="text-center text-gray-600 mt-2 text-sm italic">
                {hasLocation
                    ? "✅ Ubicación seleccionada."
                    : "Haz clic en el mapa o usa tu ubicación ♻️"}
            </div>
        </div>
    );
}
