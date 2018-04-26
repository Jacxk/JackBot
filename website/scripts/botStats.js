$.getJSON('https://jackbot-djs.herokuapp.com/botstats').done((data) => {
    $.each(data, function (key, val) {
        document.getElementById(key).innerHTML = val;
        if (key === 'status') {
            let color = '';
            if (val === 'Online') color = 'limegreen';
            else if (val === 'Offline') color = 'red';
            document.getElementById('status').style.color = color;
        }
    });
}).fail(() => {
    document.getElementById('status').innerHTML = 'Offline';
    document.getElementById('status').style.color = 'red';

    document.getElementById('users').innerHTML = 'Error...';
    document.getElementById('users').style.color = 'red';

    document.getElementById('guilds').innerHTML = 'Error...';
    document.getElementById('guilds').style.color = 'red';

    document.getElementById('commands').innerHTML = 'Error...';
    document.getElementById('commands').style.color = 'red';
});