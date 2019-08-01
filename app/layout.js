"use strict";
import './layout.scss';

$(function () {
    console.log("Ready", '$', $.fn.jquery);

    const fetch = () => $.get('/sql.php', data => {
        $('#myTabContent tbody').empty();
        data = JSON.parse(data);
        if ( data.length ) {
            data.forEach( row => {
                let tr = $('<tr>');
                if ( row.sale_amounts && row.sale_dates ) {
                    tr.html(`<td>${row.address}</td><td>${row.city}, ${row.state} ${row.zip}</td>`);

                    let amounts = row.sale_amounts.split(',');
                    let dates = row.sale_dates.split(',');
                    let td = $('<td class="sales-history">');

                    amounts.forEach( (sale, index) => {
                        let price = parseInt(sale).toLocaleString();
                        let dateTime = new Date(Date.parse(dates[index]));
                        let dateString = (dateTime.getMonth() +1) +'-'+ dateTime.getDate() +'-'+ dateTime.getFullYear();

                        td.append(`<p>$${price} on ${dateString}</p>`)
                    });
                    tr.append(td);

                    $("#table-sold tbody").append(tr);
                } else {
                    tr.html(
                        `<td>${row.address}</td><td>${row.city}, ${row.state} ${row.zip}</td>`);
                    $("#table-unsold tbody").append(tr);                    
                }

                let managetr = $('<tr>');
                let history = '';
                if ( row.sale_amounts ) {
                    history = row.sale_amounts.split(',').length + ' Sales';
                }

                managetr.html(`<td>${row.id}</td><td>${row.address}</td><td>${row.city}, ${row.state} ${row.zip}</td>
                            <td>${history}</td>
                            <td data-id=${row.id} class="text-right">
                                <button type="button" class="btn btn-primary btn-sm edit" data-toggle="modal" data-target="#propertyModal" data-raw='${JSON.stringify(row)}'><i class="fa fa-edit"></i> Edit</button>
                                <button type="button" class="btn btn-primary btn-sm sale" data-toggle="modal" data-target="#addSaleModal" data-raw='${JSON.stringify(row)}'><i class="fa fa-plus"></i> Add Sale</button>
                                <button type="button" class="btn btn-danger btn-sm del"><i class="fa fa-minus-circle"></i> Delete</button>
                                </td>`);
                $("#table-all tbody").append(managetr);

            })
        } else {
            let nodata = '<tr><td colspan="3">No properties to list.</td></tr>';
            $('#table-sold, #table-unsold, #table-all').append(nodata);
        }
    });
    fetch();

    $('#submitHomeAdd').click(() => {

        let cereal = new Array($('#updateAddress').val(),$('#updateCity').val(),$('#updateState').val(),$('#updateZip').val()).join('|');
        $.ajax({
            type: "POST",
            url: '/sql.php',
            data: {
                action: 'addNew',
                data : cereal
            },
            success: response => {
                if ( response) {
                    $("[data-dismiss=modal]").trigger({ type: "click" });
                    $('#propertyModal input.form-control').val('');
                    fetch();
                }
            },
            dataType: 'json'
          });
    });

    $('#submitHomeEdit').click(() => {
        let id = $('#submitHomeEdit').attr('data-id');
        let cereal = new Array(id, $('#updateAddress').val(),$('#updateCity').val(),$('#updateState').val(),$('#updateZip').val()).join('|');

        $.ajax({
            type: "POST",
            url: '/sql.php',
            data: {
                action: 'edit',
                data : cereal
            },
            success: response => {
                if ( response) {
                    $("[data-dismiss=modal]").trigger({ type: "click" });
                    $('#addSaleModal input.form-control').val('');
                    fetch();
                }
            },
            dataType: 'json'
          });
    });

    $('#submitSale').click(() => {
        let id = $('#submitSale').attr('data-id');
        let timestamp = new Date($('#salesDate').val()).toJSON().slice(0, 19).replace('T', ' ')
        let cereal = new Array(id, timestamp,$('#salesAmount').val()).join('|');

        $.ajax({
            type: "POST",
            url: '/sql.php',
            data: {
                action: 'addSale',
                data : cereal
            },
            success: response => {
                if ( response) {
                    $("[data-dismiss=modal]").trigger({ type: "click" });
                    $('#propertyModal input.form-control').val('');
                    fetch();
                }
            },
            dataType: 'json'
          });
    });


    $("#manage button.new").click(()=> {
        $('#propertyModal input.form-control').val('');
        $("#submitHomeAdd").show();
        $("#submitHomeEdit").hide();

        $('#updateAddress').attr('readonly', false);
    })

    $("#table-all").on('click', '[data-id] button.del', function(e) {
        let id = $(e.target).closest('td').attr('data-id');

        $.ajax({
            type: "POST",
            url: '/sql.php',
            data: {
                action: 'delete',
                data : id
            },
            success: response => {
                if ( response ) {
                    $(e.target).closest('tr').fadeOut(function(){ fetch();});
                }
            },
            dataType: 'json'
          }); 
    });
    
    $("#table-all").on('click', '[data-id] button.edit', function(e) {
        let id = $(e.target).closest('td').attr('data-id');
        let data = JSON.parse($(e.currentTarget).attr('data-raw'));

        $('#updateAddress').val(data.address).attr('readonly', true);
        $('#updateCity').val(data.city)
        $('#updateState').val(data.state)
        $('#updateZip').val(data.zip)

        $("#submitHomeAdd").hide();
        $("#submitHomeEdit").show().attr('data-id', data.id);
    });

    $("#table-all").on('click', '[data-id] button.sale', function(e) {
        let id = $(e.target).closest('td').attr('data-id');
        let data = JSON.parse($(e.currentTarget).attr('data-raw'));

        $("#salesProperty").val(data.address);
        $("#salesDate, #salesAmount").val('');
        $("#submitSale").show().attr('data-id', data.id);

    });
});

// Easter egg
let globalKeys = [];
document.addEventListener('keydown', (e) => {
    globalKeys.push(e.keyCode);
    globalKeys = globalKeys.slice(-10);
    if (globalKeys.toString().indexOf("38,38,40,40,37,39,37,39,66,65") >= 0) {
        alert('Konami!');
        globalKeys = [];
    }
});