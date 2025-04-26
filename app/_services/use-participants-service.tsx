import { useParticipantStore } from "../store/use-participant-store";

interface IParticipantService{
    getParticipants: () => void;
    getParticipant: (participantId: string) => Promise<void>;
    updateParticipant: (participant: IParticipant) => Promise<void>;
    deleteParticipant: (participantId: string) => Promise<void>;
    addNewParticipant: (participant: IParticipant) => void;
}

export function useParticipantService(): IParticipantService{
    const {participant, participants, currentParticipant, setParticipant, setParticipants, setCurrentParticipant, updateParticipant, deleteParticipant, addNewParticipant} = useParticipantStore();
    return {
        getParticipants: () => {
            console.log("getParticipants");
        },
        getParticipant: async (participantId) => {
            console.log("getParticipant");
        },
        updateParticipant: async (participant) => {
            console.log("updateParticipant");
            updateParticipant(participant);
        },
        deleteParticipant: async (participantId) => {
            console.log("deleteParticipant");
            deleteParticipant(participantId);
        },
        addNewParticipant(participant) {
            console.log("addNewParticipant");
            addNewParticipant(participant);
        },
    }
}