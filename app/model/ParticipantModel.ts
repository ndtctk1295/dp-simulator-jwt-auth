interface IParticipant {
    participantId: string;
    dpTppId: string;
    shortName: string;
    fullName: string;
    role: string;
    status: string;
    email: string;
    phone: string;
    logo: string;
    scopes: string;
    joinDate: Date;
    activeDate: Date;
    endDate: Date;
}