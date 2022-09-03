const formatCurrency = (sum) => isNaN(sum) ? '' : new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' }).format(sum);

const handleVisibility = () => {
    if (document.getElementById('usage_kWt_option').checked) {
        document.getElementById('watttime').classList.add('hidden');
        document.getElementById('kWt').classList.remove('hidden');
    } else {
        document.getElementById('watttime').classList.remove('hidden');
        document.getElementById('kWt').classList.add('hidden');
    }
};

const getKwtUsage = () => {
    if (document.getElementById('usage_kWt_option').checked) {
        return parseFloat(document.getElementById('kwt_usage').value);
    }
    const watt = parseFloat(document.getElementById('watt_usage').value);
    const time_minutes = parseFloat(document.getElementById('time').value);
    const time_hours = time_minutes/60;
    const kilowatt = watt/1000;
    return kilowatt*time_hours;
}


const calculate = () => {
    handleVisibility();

    const usage = getKwtUsage();

    const energyprice_kr = parseFloat(document.getElementById('energyprice').value)/100;
    const energy_usage = energyprice_kr*usage;
    document.getElementById('result_energyprice').innerText = formatCurrency(energyprice_kr);
    document.getElementById('result_energy_usage').innerText = formatCurrency(energy_usage);
    
    const nettleie = parseFloat(document.getElementById('nettleie').value)/100;
    const nettleie_usage = nettleie*usage;
    document.getElementById('result_nettleie').innerText = formatCurrency(nettleie);
    document.getElementById('result_nettleie_usage').innerText = formatCurrency(nettleie_usage);
    
    const enova = 0.01;
    const enova_usage = enova*usage;
    document.getElementById('result_enova').innerText = formatCurrency(enova);
    document.getElementById('result_enova_usage').innerText = formatCurrency(enova_usage);

    const elavgift = 0.1541;
    const elavgift_usage = elavgift*usage;
    document.getElementById('result_elavgift').innerText = formatCurrency(elavgift);
    document.getElementById('result_elavgift_usage').innerText = formatCurrency(elavgift_usage);

    const before_mva_per_kwt = energyprice_kr + nettleie + enova + elavgift;
    const energyusagetotal = energy_usage + nettleie_usage + enova_usage + elavgift_usage;

    const mva_per_kwt = before_mva_per_kwt * 0.25;
    const mva = energyusagetotal * 0.25;
    document.getElementById('result_mva').innerText = formatCurrency(mva_per_kwt);
    document.getElementById('result_mva_usage').innerText = formatCurrency(mva);

    const stromstotte = energyprice_kr <= 0.7 ? 0 : (energyprice_kr-0.7)*0.9*1.25;
    const stromstotte_usage = stromstotte*usage;
    document.getElementById('result_stromstotte').innerText = formatCurrency(stromstotte);
    document.getElementById('result_stromstotte_usage').innerText = formatCurrency(stromstotte_usage);
    
    const final_per_kwt = before_mva_per_kwt + mva_per_kwt - stromstotte
    const sum = energyusagetotal + mva - stromstotte_usage;
    document.getElementById('result_sum').innerText = formatCurrency(final_per_kwt);
    document.getElementById('result_sum_usage').innerText = formatCurrency(sum);

    document.getElementById('result').innerText = formatCurrency(sum);
    document.getElementById('result_utenstromstotte').innerText = formatCurrency(energyusagetotal + mva);
}

const populate_nettleverador = (e, foo) => {
    const value = parseFloat(document.getElementById('nettleverador').value);
    document.getElementById('nettleie').value = value;
    calculate();
};

document.getElementById('energyprice').addEventListener('change', calculate);
document.getElementById('kwt_usage').addEventListener('change', calculate);
document.getElementById('nettleie').addEventListener('change', calculate);
document.getElementById('usagetyperadio').addEventListener('change', calculate);
document.getElementById('watt_usage').addEventListener('change', calculate);
document.getElementById('time').addEventListener('change', calculate);

document.getElementById('energyprice').addEventListener('keyup', calculate);
document.getElementById('kwt_usage').addEventListener('keyup', calculate);
document.getElementById('nettleie').addEventListener('keyup', calculate);
document.getElementById('watt_usage').addEventListener('keyup', calculate);
document.getElementById('time').addEventListener('keyup', calculate);

document.getElementById('nettleverador').addEventListener('change', populate_nettleverador);

populate_nettleverador();
