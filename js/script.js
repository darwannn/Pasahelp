let kilometerText = document.querySelector(".kilometer");
let kilometerLabel = document.querySelector(".kilometerLabel");
let normalFareText = document.querySelector(".normalFare");
let discountedFareText = document.querySelector(".discountedFare");
let normalFareLabel = document.querySelector(".normalFareLabel");
let discountedFareLabel = document.querySelector(".discountedFareLabel");
let container = document.querySelector(".container");

window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector(".modal").style.cssText =
            " animation: 1s fadeOut linear forwards;";
    }, 1000);
});
fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
        mapboxgl.accessToken = data.key;
        const directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            steps: false,
            geometries: 'polyline',
            /* country: 'PH', */
            controls: {
                instructions: false,
            }
        });

        const navigation = new mapboxgl.NavigationControl({
            showCompass: false,
            showZoom: true
        });

        const location = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        });

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/nydigorith/ckw3mdv960ft514pqy0sydxv8',
            center: [121.025, 14.6],
            maxBounds: [
                [112.18040199555708, 4.378045585082305],
                [132.72033481430617, 20.92928212653746]
            ],
            zoom: 10
        });

        map.addControl(directions, 'top-left');
        map.addControl(navigation, 'top-right');
        map.addControl(location, 'top-left');
        map.on("wheel", event => {
            if (event.originalEvent.ctrlKey) {
              return;
            }
          
            if (event.originalEvent.metaKey) {
              return;
            }
          
            if (event.originalEvent.altKey) {
              return;
            }
          
            event.preventDefault();
          });
        map.on('load', () => {
            directions.on('route', (event) => {

                let distance = `${JSON.stringify(event.route[0].distance, null, 2)}`;
                let normalFare = data.normalFare;
                let discountedFare = data.discountedFare;
                let normalAdditionalFare = data.normalAdditionalFare;
                let discountedAdditionalFare = data.discountedAdditionalFare;

                //Math.floor();
                let kilometer = Math.round(distance / 1000);
                let meter = Math.floor(distance);

                if (kilometer == 0) {
                    kilometerText.innerHTML =
                        `${meter} M`;
                } else {
                    kilometerText.innerHTML =
                        `${kilometer} KM`;
                }

                window.addEventListener("resize", () =>{
                    if (window.innerWidth < 577) {
                        kilometerLabel.style.display = "none";
                    } else {
                        kilometerLabel.style.display = "flex";
                    }
                });
               

                if (kilometer < 5) {
                    normalFareLabel.style.display = "flex";
                    discountedFareLabel.style.display = "flex";

                    Number.isInteger(normalFare) ?
                        normalFareText.innerHTML = `${normalFare} PHP` :
                        normalFareText.innerHTML = `${normalFare.toFixed(2)} PHP`;

                    Number.isInteger(discountedFare) ?
                        discountedFareText.innerHTML = `${discountedFare} PHP` :
                        discountedFareText.innerHTML = `${discountedFare.toFixed(2)} PHP`;

                } else if (kilometer > 50) {
                    if (window.innerWidth < 577) {
                        kilometerLabel.style.display = "flex";
                    }
                    kilometerText.innerHTML = "Out of Range";
                    normalFareLabel.style.display = "none";
                    discountedFareLabel.style.display = "none";
                } else {
                    for (let i = 4; i < kilometer; i++) {
                        normalFare = normalFare + normalAdditionalFare;
                        discountedFare = discountedFare + discountedAdditionalFare;
                    }

                    normalFareLabel.style.display = "flex";
                    discountedFareLabel.style.display = "flex";

                    let normal = parseFloat((normalFare).toFixed(10));
                    Number.isInteger(normal) ?
                        normalFareText.innerHTML = `${normal} PHP` :
                        normalFareText.innerHTML = `${normal.toFixed(2)} PHP`;

                    let discounted = parseFloat((discountedFare).toFixed(10));
                    Number.isInteger(discounted) ?
                        discountedFareText.innerHTML = `${discounted} PHP` :
                        discountedFareText.innerHTML = `${discounted.toFixed(2) } PHP`;
                }
                container.classList.remove("onClose");
                container.style.display = "flex";
            });
        });
    });

document.querySelector(".close").addEventListener("click", () => {
    container.classList.add("onClose");
});