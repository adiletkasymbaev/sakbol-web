// @ts-nocheck
import { useEffect, useState } from "react";
import { useGetFavoritesQuery } from "../../../features/contacts/favoritesApi";
import BottomSheet from "../components/BottomSheet";
import ContactItem from "../../../shared/components/ContactItem";
import Heading from "../../../shared/components/Heading";
import Margin from "../../../shared/components/Margin";
import Navbar from "../../../shared/components/Navbar";
import RenderWithSpinner from "../../../shared/components/RenderWithSpinner";
import Map from '../components/Map';
import LocationUpdater from "../../../shared/components/LocationUpdater";
import { addToast } from "@heroui/react";
import { ToastTypes } from "../../../shared/enums/ToastTypes";

function SosMainPage() {
    const { data: favoriteContacts, isLoading } = useGetFavoritesQuery()
    const [targetPosition, setTargetPosition] = useState<[number, number]>([42.85903549194336, 74.58454132080078]);
    const [userPosition, setUserPosition] = useState<[number, number]>([42.85903549194336, 74.58454132080078]);
    const [isFocused, setFocused] = useState(false)
    const [zoom, setZoom] = useState(12)

    useEffect(() => {
        const handler = (lat: number, lon: number) => {
            setTargetPosition([lat, lon])
            setUserPosition([lat, lon])
        };
        window.onLocationUpdate = handler;
        return () => { delete window.onLocationUpdate; };
    }, []);

    useEffect(() => {
        window.onVoskResult = (hyp) => {
        try {
            const obj = typeof hyp === 'string' ? JSON.parse(hyp) : hyp;
            const text = obj?.text?.trim?.();
            if (!text) return;

            const words = text.toLowerCase().split(/\s+/).filter(Boolean);
            const signal = words.length >= 3 ? 'B' : 'A';

            addToast({
                title: ToastTypes.OK,
                description: '[VOSK] final: ' + text + ' → ' + signal,
                color: "success",
            });
        } catch (e) {
            console.error('[VOSK] bad hypothesis:', hyp, e);
        }
        };
    }, []);

    const content = (
        <div className="page-wrapper-no-padding">
            <Map zoom={zoom} setZoom={setZoom} targetPosition={targetPosition} userPosition={userPosition}/>

            {/* <LocationUpdater isFocused={isFocused} setTargetPosition={setTargetPosition} setUserPosition={setUserPosition}/> */}

            <BottomSheet onClick={() => setTargetPosition(userPosition)}>
                <Heading variant="card">
                    Ваши контакты
                </Heading>
                <Margin direction="b" value={2}/>
                <RenderWithSpinner isLoading={isLoading} isEmpty={favoriteContacts?.count === 0} emptyText="Нет избранных контактов">
                    <div className="flex flex-col gap-2">
                        {favoriteContacts?.results?.map(favorite => (
                            <ContactItem 
                                key={favorite.id}
                                contact={favorite.contact} 
                                onClick={() => {
                                    setTargetPosition([favorite?.location?.latitude, favorite?.location?.longitude])
                                    setFocused(true)
                                }} 
                            />
                        ))}
                    </div>
                    <Margin direction="b" value={6}/>
                </RenderWithSpinner>
            </BottomSheet>
            
            <Navbar/>
        </div>
    );

    return content;
}

export default SosMainPage;