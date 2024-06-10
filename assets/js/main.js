let weather = {
    apiKey: "e38f2a97aa9f4ae7af64ec0334bb416e",
    map: null,
    marker: null,
    initializeMap: function () {
        this.map = L.map('map').setView([46.58, 0.34], 10);  // Coordonnées initiales centrées sur Poitiers
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    },


    fetchWeather: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&units=metric&appid=" +
          this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("Pas de météo trouvée.");
            throw new Error("Pas de météo trouvée.");
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
      const { name } = data;
      const { country } = data.sys;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      const { lon, lat } = data.coord;

      document.querySelector(".city").innerText =  name;
      document.querySelector(".country").innerText = country;
      document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText =
        "Humidité : " + humidity + "%";
      document.querySelector(".wind").innerText =
        "vitesse du vent : " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");

      let backgroundImage;
        if (description.includes("nuageux") || description.includes("cloud")) {
            backgroundImage = "url('assets/images/nuageux.jpg')";
        } else if (description.includes("ensoleillé") || description.includes("sun") || description.includes("clear")) {
            backgroundImage = "url('assets/images/ensoleille.jpg')";
        } else if (description.includes("pluie") || description.includes("rain")) {
            backgroundImage = "url('assets/images/pluie.jpg')";
        } else if (description.includes("neige") || description.includes("snow")) {
            backgroundImage = "url('assets/images/neige.jpg')";
        } else if (description.includes("brouillard") || description.includes("mist")) {
                backgroundImage = "url('assets/images/brouillard.jpg')";
        } else {
            backgroundImage = "url('assets/images/default.jpg')";
        }
        document.body.style.backgroundImage = backgroundImage;


        // Mettre à jour la carte avec Leaflet
    if (this.marker) {
        this.map.removeLayer(this.marker);
    }
    this.map.setView([lat, lon], 10);
    this.marker = L.marker([lat, lon]).addTo(this.map)
        .bindPopup(`<b>${name}</b><br>${description}`)
        .openPopup();
    },




    search: function () {
      this.fetchWeather(document.querySelector(".search-bar").value);
    },
  };


// Ensure the map is initialized after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    weather.initializeMap();
    weather.fetchWeather("Poitiers");
});

  
  document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
  });
  
  document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
      if (event.key == "Enter") {
        weather.search();
      }
    });
  
  weather.fetchWeather("Poitiers");