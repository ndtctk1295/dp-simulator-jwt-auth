interface IProvider extends CoreModel {
  uuid: string;
  icon: any;
  bankCode: string;
  fullName: string;
  shortName: string;
  status: string;
  url: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  authUrl: string;
  period: string;
  activationDate: Date;
  exclusions: string;
}
