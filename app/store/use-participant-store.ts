import { set } from 'mongoose';
import {create} from "zustand";

export interface ParticipantStore{
    participants: IParticipant[]; //all participants
    participant: IParticipant ; 
    currentParticipant: IParticipant ;
    // filters: IFilterParticipant
    setParticipants: (participants: IParticipant[]) => void;
    setParticipant: (participant: IParticipant) => void;
    setCurrentParticipant: (participant: IParticipant) => void;
    updateParticipant: (participant: IParticipant) => void;
    deleteParticipant: (participantId: string) => void;
    addNewParticipant: (participant: IParticipant) => void;
    // setFilters: (filters: IFilterParticipant) => void;
}

export const useParticipantStore = create<ParticipantStore>((set) => ({
    participants: [] as IParticipant[],
    participant: {} as IParticipant,
    currentParticipant: {} as IParticipant,
    updateParticipant: (participant) => {
        set((state) => ({
            participants: state.participants.map((p) =>
                p.participantId === participant.participantId ? participant : p
            )
        }));
    },
    deleteParticipant: (participantId) => {
        set((state) => ({
            participants: state.participants.filter(p => p.participantId !== participantId)
        }));
    },
    
    setParticipants: (participants) => set({participants}),
    setParticipant: (participant) => set({participant}),
    setCurrentParticipant: (participant) => set({currentParticipant: participant}),
    addNewParticipant(participant) {
        set((state) => ({
            participants: [...state.participants, participant]
        }));
    },
}));