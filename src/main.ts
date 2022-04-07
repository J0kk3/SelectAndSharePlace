import axios from "axios";

const form = document.querySelector("form")!;
const adressInput = document.getElementById("adress")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyBvjRAabfq1kl69aciVx_27eSt8m882KsM";

type GoogleGeocodingResponse =
    {
        results: { geometry: { location: { lat: number, lng: number } } }[];
        status: "OK" | "ZERO_RESULTS";
    };

function searchAdressHandler(event: Event)
{
    event.preventDefault();
    const enteredAdress = adressInput.value;

    //Send this to Google's API
    axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAdress)}&key=${GOOGLE_API_KEY}`)
        .then(response => 
        {
            if (response.data.status !== "OK")
            {
                throw "Could not fetch location!";
            }
            const coordinates = response.data.results[ 0 ].geometry.location;
            const map = new google.maps.Map(document.getElementById("map") as HTMLElement,
                {
                    center: coordinates,
                    zoom: 16,
                });
                //Place a marker on the map
                new google.maps.Marker({position: coordinates, map: map});
        }).catch(err =>
        {
            alert(err.message);
            console.log(err);
        });
}
form.addEventListener("submit", searchAdressHandler);