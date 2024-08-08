1. Select venue in gmaps
2. run
```
{"name": document.querySelector('.id-content-container').querySelectorAll('#pane ~ div div div div div.bJzME')[1].querySelector('div:nth-child(2) > div > div > div > div > div:nth-child(2) > div > div > div').textContent,"address": document.querySelector('.id-content-container').querySelector('#pane ~ div div div div div:nth-child(7) div:nth-child(3)').textContent, "numberOfRatings": document.querySelector('.id-content-container').querySelectorAll('#pane ~ div div div div div.bJzME')[1].querySelector('div:nth-child(2) > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2)').textContent.split('(')[1],"medianRating": document.querySelector('.id-content-container').querySelectorAll('#pane ~ div div div div div.bJzME')[1].querySelector('div:nth-child(2) > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2)').textContent.split('(')[0]}
```
in the browser console
3. copy object
4. paste in the data.json