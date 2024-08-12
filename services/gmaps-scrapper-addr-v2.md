1. Select venue in gmaps
2. run
```
const [latitude, longitude] = window.location.href.split('!8m2!3d')[1].split('!16s%')[0].split('!4d').map(parseFloat); console.log({latitude, longitude});
```
in the browser console
3. copy object
4. paste in the data.json
