/*BREWERY SEARCH VARIABLES*/
const breweryURL = 'https://api.openbrewerydb.org/breweries';
let urlString;

/*BEER SEARCH VARIABLES*/
let beerArray = [];
let params;
let sort;
let maxNum;
const beerURL = 'https://api.punkapi.com/v2/beers';
/*INPUT BUTTONS, TOGGLECLASSES*/
function setUp() {
    $('#beerParameterButton').click(event => {
        $('.beerParameterButton').toggleClass('hidden');
    })
    $('#foodParameterButton').click(event => {
        $('.foodParameterButton').toggleClass('hidden');
    })
    $('#abvParameterButton').click(event => {
        $('.abvParameterButton').toggleClass('hidden');
    })
    $('#ibuParameterButton').click(event => {
        $('.ibuParameterButton').toggleClass('hidden');
    })
    $('#ebcParameterButton').click(event => {
        $('.ebcParameterButton').toggleClass('hidden');
    })
    $('#numParameterButton').click(event => {
        $('.numParameterButton').toggleClass('hidden');
    })
    $('#sortParameterButton').click(event => {
        $('.sortParameterButton').toggleClass('hidden');
    })
    $('#ibuFacts').click(event => {
        $('.IBU').toggleClass('hidden');
    });
    $('#abvFacts').click(event => {
        $('.ABV').toggleClass('hidden');
    });
    $('#ebcFacts').click(event => {
        $('.EBC').toggleClass('hidden');
    });
    /*RESET SEARCH BUTTONS*/
    $('.reset').click(event => {
        beerArray = [];
        params = {};
        $('.beerResult').remove();
        $('.zeroResults').remove();
        $('.reset').addClass('hidden');
    })
    $('.reset2').click(event => {
        $('.brewResults').remove();
        $('.zeroResults').remove();
        $('.reset2').addClass('hidden');
    })
}


/*BEER SEARCH CODE*/
function displayBeers() {
    if (beerArray.length === 0) {
        ($('.beerResults').append(`<p class="zeroResults"> There are no Beers that match your search.</p>`))
    } else {
        for (let i = 0; i < beerArray.length; i++) {
            $('.beerResults').append(`<ul id="beerName" class="beerResult"><span id="bname">${beerArray[i]['beerName']}</span>
            <li id="tagline"><span class="bold">${beerArray[i]['tagLine']}</span></li>
            <li id="description">${beerArray[i]['descriptions']}</li>
            <li id="food"><span class="bold">Great Food Pairings:</span> ${beerArray[i]['foodPairing']}</li>
            <li id="tips"> <span class="bold">Brewers Tip:</span> ${beerArray[i]['brewersTips']}</li>
            <li id="brewDate"><span class="bold">First Brewed:</span> ${beerArray[i]['firstBrewed']}</li><div id="beerUnits">
            <li id="abv"><span class="bold">ABV: </span> ${beerArray[i]['abv']}</li>
            <li id="ibu"><span class="bold">IBU: </span> ${beerArray[i]['ibu']}</li>
            <li id="ebc"><span class="bold">EBC: </span> ${beerArray[i]['ebc']}</li></div></ul>`)
        }
    }
    $('.reset').removeClass('hidden');
}

function sortBeers(beerArray) {
    if (sort === 'Name') {
        beerArray.sort(function(a, b) {
            return a['beerName'].localeCompare(b['beerName']);
        });
    }
    if (sort === 'ABVgreater') {
        beerArray.sort((a, b) => a['abv'] - b['abv']);
    }
    if (sort === 'ABVless') {
        beerArray.sort((a, b) => b['abv'] - a['abv']);
    }
    if (sort === 'IBUgreater') {
        beerArray.sort((a, b) => a['ibu'] - b['ibu']);
    }
    if (sort === 'IBUless') {
        beerArray.sort((a, b) => b['ibu'] - a['ibu']);
    }
    if (sort === 'EBCgreater') {
        beerArray.sort((a, b) => a['ebc'] - b['ebc']);
    }
    if (sort === 'EBCless') {
        beerArray.sort((a, b) => b['ebc'] - a['ebc']);
    }
    displayBeers();
}

function createBeerArrayObj(responseJson) {

    let x = responseJson.splice(0, maxNum);

    for (let i = 0; i < x.length; i++) {
        beerArray.push({
            beerName: x[i].name,
            tagLine: x[i].tagline,
            descriptions: x[i].description,
            firstBrewed: x[i].first_brewed,
            brewersTips: x[i].brewers_tips,
            foodPairing: x[i].food_pairing.join(),
            ingredients: x[i].ingredients,
            volume: x[i].volume,
            ibu: x[i].ibu,
            abv: x[i].abv,
            ebc: x[i].ebc
        });
    }
    sortBeers(beerArray);
}

function fetchBeerURL(queryString) {
    let beerURLstring = `${beerURL}?${queryString}`;
    fetch(beerURLstring)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => createBeerArrayObj(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });

}

function beerStart() {
    $('#beerButton').click(event => {
        beerArray = [];
        params = {};
        $('.beerResult').remove();
        $('.zeroResults').remove();
        maxNum = $('#maxNum').val();
        params = {
            beer_name: $('#beerByName').val(),
            food: $('#foods').val(),
        }
        if ($('#abvSelect').val() === 'greaterThan') {
            params['abv_gt'] = $('#abvNum').val();;
        }
        if ($('#abvSelect').val() === 'lessThan') {
            params['abv_lt'] = $('#abvNum').val();;
        }
        if ($('#ibuSelect').val() === 'greaterThan') {
            params['ibu_gt'] = $('#ibuNum').val();;
        }
        if ($('#ibuSelect').val() === 'lessThan') {
            params['ibu_lt'] = $('#ibuNum').val();;
        }
        if ($('#ebcSelect').val() === 'greaterThan') {
            params['ebc_gt'] = $('#ebcNum').val();
        }
        if ($('#ebcSelect').val() === 'lessThan') {
            params['ebc_lt'] = $('#ebcNum').val();
        }
        sort = $('#sort').val();

        /*this replaces any spaces with underscores*/
        params.beer_name = params.beer_name.replace(/[^A-Z0-9]+/ig, "_");
        params.food = params.food.replace(/[^A-Z0-9]+/ig, "_");

        /*this function allows the object to filter out an empty string*/
        Object.filter = (obj, predicate) =>
            Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce((res, key) => (res[key] = obj[key], res), {});

        let filtered = Object.filter(params, param => param != "");

        const queryItems = Object.keys(filtered)
            .map(key => `${key}=${filtered[key]}`)
        let queryString = queryItems.join('&');
        fetchBeerURL(queryString);
    })

}

/*THIS IS THE CODE FOR THE BREWERY API SEARCH*/
function spliceWebsiteUrl(url) {
    let ar = url.split('');
    let websiteMinusHTTPS = ar.splice(11);
    return (websiteMinusHTTPS.join(''));
}

function displayBreweries(x) {
    let phoneDisplay = [];
    if (x.length === 0) {
        $(`.breweryResults`).append(`<p class="zeroResults"> There are no Breweries that match your search.</p>`);
    }
    for (let i = 0; i < x.length; i++) {

        if (x[i].website_url === '') {
            x[i].website_url = "Website is not listed";
        }
        if (x[i].phone === '') {
            phoneDisplay.push('Phone number not listed');
        } else {
            phoneDisplay.push(`(${x[i].phone[0]}${x[i].phone[1]}${x[i].phone[2]}) ${x[i].phone[3]}${x[i].phone[4]}${x[i].phone[5]}-${x[i].phone[6]}${x[i].phone[7]}${x[i].phone[8]}${x[i].phone[9]}`);
        };
        $(`.breweryResults`).append(`<ul class="brewResults" id="breweryName"><span id="brewName">${x[i].name}</span><li id="brewCity">${x[i].city}, ${x[i].state}</li>
        <li id="website"><a href="${x[i].website_url}" target="_blank">${spliceWebsiteUrl(x[i].website_url)}</a></li>
        <li id="phoneNumber"><a href="tel:+${phoneDisplay[i]}">${phoneDisplay[i]}</a></li>`);
    }
    $('.reset2').removeClass('hidden');
}


function fetchBreweries() {
    fetch(urlString)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayBreweries(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}


function breweriesStart() {
    $('#breweryButton').click(event => {
        $('.brewResults').remove();
        $('.zeroResults').remove();

        let breweryCity = $('#brewerySearch').val();
        let breweryState = $('#state').val();
        urlString = `${breweryURL}?by_city=${breweryCity}&by_state=${breweryState}`;
        fetchBreweries(urlString);
    });
}

function start() {
    breweriesStart();
    beerStart();
    setUp();
}

$(start);