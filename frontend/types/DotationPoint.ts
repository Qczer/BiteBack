export interface DotationPointProps {
    name: string;
    description: string;
    city: string;
    postalCode: string;
    street: string;
    number: string;
    authorized: string;
    location: {type: string, coordinates: [number, number]};
}

export default class DotationPoint {
    name: string;
    description: string;
    city: string;
    postalCode: string;
    street: string;
    number: string;
    authorized: string;
    location: [number, number];

    constructor(props: DotationPointProps) {
        this.name = props.name;
        this.description = props.description;
        this.city = props.city;
        this.postalCode = props.postalCode;
        this.street = props.street;
        this.number = props.number;
        this.authorized = props.authorized;
        this.location = props.location.coordinates;
      }

}