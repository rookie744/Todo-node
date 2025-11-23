const complete_btn = document.querySelectorAll('.complete_btn');
complete_btn.forEach((btn) => {
    btn.addEventListener('click',() => {
        // console.log(btn.dataset.id);
        status = (btn.dataset.status) === 'completed' ?  'in-progress' : 'completed';
        const endpoint = `/update/${btn.dataset.id}/${status}`;
        fetch(endpoint,{
            method : 'PUT',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: 'value' })
        })
        .then(response => response.json())
        .then(data => window.location.href = data.redirect )
        .catch(err => console.log(err));
    });
});

const delete_btn = document.querySelectorAll('.delete_btn');
delete_btn.forEach((btn) => {
    btn.addEventListener('click',() => {
        const endpoint = `/delete/${btn.dataset.id}`;
        fetch(endpoint,{
            method : 'DELETE'
        })
        .then((result) => result.json())
        .then((data) => window.location.href = data.redirect)
        .catch((err) => console.log(err));
    });
});


document.querySelectorAll('.completed > span').forEach((span) => span.innerHTML = span.innerHTML.strike());