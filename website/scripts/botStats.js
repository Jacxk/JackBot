$.getJSON('https://jackbot-djs.herokuapp.com/botstats.json', function(response) {
    console.log(response);

    $.each(response, function (key, val) {
        document.getElementById(key).innerHTML = val;
        if (key === 'status') {
            let color = '';
            if (val === 'Online') color = 'limegreen';
            else if (val === 'Offline') color = 'red';
            document.getElementById('status').style.color = color;
        }
    });
});