'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map,mapEvent;

class workOut{
  date = new Date();
  id = (Date.now() + '').slice(-10);   
    constructor(coords,distance,duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;;
    }
}

class Running extends workOut{
  
    type = 'running';
    constructor(coords,distance,duration,cadence){
        super(coords,distance,duration);
        this.cadence = cadence;
        this.calaPace();
    }

    calaPace(){
        this.pace = this.duration / this.distance;
        return this.pace
    }
}
class Cycling extends workOut{      

     type= 'cycling';
    constructor(coords,distance,duration,ElevationGain){
        super(coords,distance,duration);
        this.ElevationGain = ElevationGain;
        this.speed;
    }

    calcSpeed(){
        this.speed =  this.distance / (this.duration/60);
        return this.speed;
    }

}

class App{
    #map;
    #mapEvent;
    #workouts = [];
    constructor(){
        this._getPosition();
        form.addEventListener('submit',this._newWorkout.bind(this));
         inputType.addEventListener('change',this._toggleElevationFiled);
    }

    _getPosition(){
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){
            alert("Could Not Get");
        })
    }

    _loadMap(position){
            const {latitude} = position.coords;
            const {longitude} = position.coords;
            console.log(latitude,longitude);
            console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
             const coords = [latitude,longitude];
             this.#map = L.map('map').setView(coords, 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
            this.#map.on('click',this._showForm.bind(this))  
    }

    _showForm(mapE){
                 this.#mapEvent=mapE;
                form.classList.remove('hidden');
                inputDistance.focus();
    }

    _toggleElevationFiled(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e){
        e.preventDefault();
        const validInputs = (...inputs) =>
        inputs.every(inp => Number.isFinite(inp));
      const allPositive = (...inputs) => inputs.every(inp => inp > 0);
           const {lat,lng} = this.#mapEvent.latlng;
         
         // get data from form
         const type = inputType.value;
         const distance = +inputDistance.value;
         const duration =  +inputDuration.value;
         let workout
        //   console.log(type,distance,duration);
         //if type is running then create a new object 
         if(type ==='running'){
             const cadence = +inputCadence.value;

             if(
            //     !Number.isFinite(distance) || 
            //  !Number.isFinite(duration) || 
            //  !Number.isFinite(cadence)
                !validInputs(distance,duration,cadence) || !allPositive(distance,duration,cadence))
                return alert('Inputs Have To Positive Number');

            workout = new Running([lat,lng],distance,duration,cadence);

          
         }

           //if type is running then create a new object 
           if(type ==='cycling'){
            const elevation = +inputElevation.value;
            
            if(!validInputs(distance,duration,elevation) || !allPositive(distance,duration)) return alert('Inputs Have To Positive Number');

            workout = new Cycling([lat,lng],distance,duration,elevation);
        }


        
         //Add new Object to workout array:
         this.#workouts.push(workout);
   
        //  console.log(workout);

            //Render Data
            this.renderWorkoutMarker(workout);

     

         inputCadence.value=inputDistance.value=inputDuration.value=inputElevation.value=' ';
    }

    renderWorkoutMarker(workout){
  
       

         L.marker(workout.coords).addTo(this.#map)
         .bindPopup(L.popup({
             maxWidth : 250,
             minWidth: 100,
             autoClose : false,
             closeOnClick:false,
             className:`${workout.type}-popup`,
     
         })).setPopupContent('Workout')
         .openPopup();
    }
    

}

const app = new App();

