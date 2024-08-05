1. Select venue in gmaps
2. click on the "avatar"/"banner" image
3. scroll to the best image from galery
4. inspect element of that image, select element with `style="background-url`, probably its previous element
5. run
```
{mediaUrl: [$0.style.getPropertyValue('background-image').split('url("')[1].split('")')[0].split('=w')[0].concat('=w408-h544-k-no')], coordinates: { latitude: Number.parseFloat(window.location.href.split('place/')[1].split('/')[1].split('@')[1].split(',')[0]), longitude: Number.parseFloat(window.location.href.split('place/')[1].split('/')[1].split('@')[1].split(',')[1])}}
```
in the browser console
6. copy object
7. paste in the data.json