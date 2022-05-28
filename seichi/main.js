

let current_lat;
let current_lon;
let amedas_json;
let initial_compass;

let shaped = false;
function set_objects(){

    set_notice("setting objects...");

    /*
    const elem = document.getElementById('wind_shape');
    //elem.setAttribute('rotation', "0 150 0");
    elem.setAttribute('rotation', `0 ${360 - parseInt(Math.max(parseInt(wind.wind_direction)-1, 0)*360/16)} 0`);
    //set_notice(`${wind_direction} ${parseInt(Math.max(parseInt(wind_direction)-1, 0)*360/16)}`);
    //elem.setAttribute('scale', `1 1 ${parseInt(wind_speed)}`);
    */
   const objects = [
	{
		model: "a-box",
		id: "id0",
		scale:"10 20 2",
		position:"0 10 0",
		rotation: "0 0 0",
		lat:35.43448,
		lon:139.61287,
		material: "color: yellow",
		src:"",
		mtl:"",

	},
	{
		model: "a-text",
		id: "id1",
		lat:35.43448,
		lon:139.61287,
		scale:"20 20 20",
		position:"0 10 0",
		value: 'sample text',
		"look-at": "[gps-camera]"
	},
	

	   

	{
		model: "a-image",
		id: "id2",
		lat:35.43438,
		lon:139.61251,
		position:"0 10 0",
		src:"https://pbs.twimg.com/media/FTrpc9zX0AE7_mJ.jpg",
		"look-at": "[gps-camera]"

	},
	
   ];

    if (!shaped){
		set_notice("adding objects...");
        let scene = document.querySelector('a-scene');
		for (let object of objects){
			set_notice(`model ${object.id} appending.`);
			//<a-box material="color: yellow" gps-entity-place="latitude: <your-latitude>; longitude: <your-longitude>" position="0 30 0"/>
			let model = document.createElement(object.model);
			if (object.material) model.setAttribute('material', object.material);
			if (object.id) model.setAttribute('id', object.id);
			if (object.lat) model.setAttribute('gps-entity-place', `latitude: ${object.lat}; longitude: ${object.lon};`);
			if (object.scale) model.setAttribute('scale', object.scale);
			if (object.position) model.setAttribute('position', object.position);
			if (object.rotation) model.setAttribute('rotation', object.rotation);
			if (object.value) model.setAttribute('rotation', object.value);
			if (object.src) model.setAttribute('rotation', object.src);
			if (object["look-at"]) model.setAttribute('look-at', object["look-at"]);
			scene.appendChild(model);
			set_notice(`model ${object.id} appended.`);
		}
		shaped = true;
		/*
        let model = document.createElement('a-obj-model');
        model.setAttribute('id', "wind_shape");
        model.setAttribute('gps-entity-place', `latitude: ${current_lat+0.00001}; longitude: ${current_lon+0.00001};`);
        model.setAttribute('src', "#arrow-obj");
        model.setAttribute('mtl', "#arrow-mtl");
        model.setAttribute('scale', `1 1 ${parseFloat(wind.wind_speed)}`);
        //model.setAttribute('scale', `1 1 1`);
        model.setAttribute('position', "0 50 0");
        //model.setAttribute('rotation', `0 90 0`);
        //model.setAttribute('rotation', `0 ${parseInt(initial_compass)%360} 0`);
        //model.setAttribute('rotation', `0 ${parseInt(initial_compass + 360 - Math.max(parseInt(wind.wind_direction)-1, 0)*360/16)%360} 0`);
        model.setAttribute('rotation', `0 ${parseInt(360 - Math.max(parseInt(wind.wind_direction)-1, 0)*360/16)} 0`);
    
        scene.appendChild(model);

        shaped = true;
		*/
        /*
        起動時の正面がrotation.y=0に設定される？オブジェクトを北向きに回転するには、スマホのコンパスを取得して最初に回転させる必要がある？
        */
    }

    /*
    const model = document.getElementById('wind_shape');
    model.setAttribute('gps-entity-place', `latitude: ${current_lat+0.00001}; longitude: ${current_lon+0.00001};`);
    */


}

function NN(n){
    return ("00" + n).slice(-2);
}

function get_location() {
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        current_lat = latitude;
        current_lon = longitude;

        set_location_info(`Latitude: ${latitude} \n Longitude: ${longitude}`);

    }

    function error() {
        set_location_info('Unable to retrieve your location');
    }

    if (!navigator.geolocation) {
        set_location_info('Geolocation is not supported by your browser');
    } else {
        set_location_info('Locating...');
        navigator.geolocation.getCurrentPosition(success, error);
    }

    window.addEventListener('deviceorientation', function(event) {
		let info = '';
		info += '方角       : ' + event.alpha;
		info += ' 上下の傾き : ' + event.beta;
		info += ' 左右の傾き : ' + event.gamma;
		info += ' コンパスの向き : ' + event.webkitCompassHeading;
		info += ' コンパスの精度 : ' + event.webkitCompassAccuracy;

        console.log('方角       : ' + event.alpha);
        console.log('上下の傾き : ' + event.beta);
        console.log('左右の傾き : ' + event.gamma);
        
        console.log('コンパスの向き : ' + event.webkitCompassHeading);
        console.log('コンパスの精度 : ' + event.webkitCompassAccuracy);

        set_device_info(info);

        if (!event.webkitCompassHeading) return;
      });
}
function set_notice(text){
    document.getElementById('general_info').innerHTML = `<pre>${text}</pre>`;
	console.log(text);
}
function set_device_info(text){
    document.getElementById('device_info').innerHTML = `<pre>${text}</pre>`;
}
function set_location_info(text){
    console.log(text);

    document.getElementById('location_info').innerHTML = `<pre>${text}</pre>`;
}
//404 Motivation Not Found, 地球上の2地点間の距離を取得するアルゴリズム(ヒュベニ or 球面三角法)比較, https://tech-blog.s-yoshiki.com/2018/05/92/
function hubeny(lat1, lng1, lat2, lng2) {
    function rad(deg) {
        return deg * Math.PI / 180;
    }
    //degree to radian
    lat1 = rad(lat1);
    lng1 = rad(lng1);
    lat2 = rad(lat2);
    lng2 = rad(lng2);

    // 緯度差
    var latDiff = lat1 - lat2;
    // 経度差算
    var lngDiff = lng1 - lng2;
    // 平均緯度
    var latAvg = (lat1 + lat2) / 2.0;
    // 赤道半径
    var a = 6378137.0;
    // 極半径
    var b = 6356752.314140356;
    // 第一離心率^2
    var e2 = 0.00669438002301188;
    // 赤道上の子午線曲率半径
    var a1e2 = 6335439.32708317;

    var sinLat = Math.sin(latAvg);
    var W2 = 1.0 - e2 * (sinLat * sinLat);

    // 子午線曲率半径M
    var M = a1e2 / (Math.sqrt(W2) * W2);
    // 卯酉線曲率半径
    var N = a / Math.sqrt(W2);

    const t1 = M * latDiff;
    const t2 = N * Math.cos(latAvg) * lngDiff;
    return Math.sqrt((t1 * t1) + (t2 * t2));
}
function get_nearest_wind(lat, lon, amedas_data){
    let wind_list = [];
    for (let key in amedas){
        const obserber = amedas[key];
        const obs_lat = obserber.lat[0] + obserber.lat[1]/60;
        const obs_lon = obserber.lon[0] + obserber.lon[1]/60;
        const distance = hubeny(lat, lon, obs_lat, obs_lon);
        wind_list.push({
            id : key,
            name: obserber.kjName,
            distance: distance,
        });
    }
    wind_list.sort(function(a,b){
        if( a.distance < b.distance ) return -1;
        if( a.distance > b.distance ) return 1;
        return 0;
    });

    for (let i = 0; i < wind_list.length; i++){
        const wind = wind_list[i];
        const location = wind.id;
        if (!amedas_data[location].wind) continue;
        if (!amedas_data[location].windDirection) continue;
        return {
            id: wind.id,
            name: wind.name,
            wind_speed: amedas_data[location].wind[0],
            wind_direction: amedas_data[location].windDirection[0],
        };

    }

}

function init(){
    console.log('init');
	set_objects();
    get_location();
}
window.onload = function (){
    console.log('onload');
    init();
}