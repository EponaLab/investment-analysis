// Education.js - Interactive functionality for the educational page

// Toggle explanation display
function toggleExplanation(id) {
    const element = document.getElementById(id + '-explanation');
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

// Show quiz answer
function showAnswer(id, answer) {
    document.getElementById(id).textContent = answer;
}

// Calculate risk premium
function calculateRiskPremium() {
    const marketReturn = parseFloat(document.getElementById('marketReturn').value);
    const riskFree = parseFloat(document.getElementById('riskFree').value);
    const premium = marketReturn - riskFree;
    
    document.getElementById('riskPremiumResult').innerHTML = `
        <strong>Market Risk Premium = ${premium.toFixed(2)}%</strong><br>
        This is the extra return investors demand for taking market risk instead of holding risk-free assets.
    `;
}

// Calculate CAPM expected return
function calculateCAPM() {
    const rf = parseFloat(document.getElementById('capm-rf').value);
    const rm = parseFloat(document.getElementById('capm-rm').value);
    const beta = parseFloat(document.getElementById('capm-beta').value);
    
    const expectedReturn = rf + beta * (rm - rf);
    
    document.getElementById('capmResult').innerHTML = `
        <strong>Expected Return = ${expectedReturn.toFixed(2)}%</strong><br>
        Calculation: ${rf.toFixed(2)}% + ${beta.toFixed(2)} × (${rm.toFixed(2)}% - ${rf.toFixed(2)}%)<br>
        = ${rf.toFixed(2)}% + ${beta.toFixed(2)} × ${(rm - rf).toFixed(2)}%<br>
        = ${expectedReturn.toFixed(2)}%
    `;
}

// Compare CAPM vs Fama-French
function compareModels() {
    const rf = 1.61;
    const mktPremium = 8.41;
    const smb = 0.87;
    const hml = 2.18;
    
    const beta = parseFloat(document.getElementById('ff-beta').value);
    const sizeLoading = parseFloat(document.getElementById('ff-size').value);
    const valueLoading = parseFloat(document.getElementById('ff-value').value);
    
    const capmReturn = rf + beta * mktPremium;
    const ff3Return = rf + beta * mktPremium + sizeLoading * smb + valueLoading * hml;
    const difference = ff3Return - capmReturn;
    
    document.getElementById('modelComparison').innerHTML = `
        <strong>CAPM Prediction:</strong> ${capmReturn.toFixed(2)}%<br>
        <strong>Fama-French Prediction:</strong> ${ff3Return.toFixed(2)}%<br>
        <strong>Difference:</strong> ${difference.toFixed(2)}%<br>
        <br>
        ${difference > 0.5 ? 
            '💡 FF3 predicts higher returns due to size/value exposures!' : 
            difference < -0.5 ?
            '💡 FF3 predicts lower returns - negative size/value exposures.' :
            '💡 Models give similar predictions - limited size/value exposure.'}
    `;
}

// Calculate Treynor-Black optimal allocation
function calculateTreyorBlack() {
    const alpha = parseFloat(document.getElementById('tb-alpha').value) / 100;
    const residualRisk = parseFloat(document.getElementById('tb-risk').value) / 100;
    const mktReturn = parseFloat(document.getElementById('tb-mkt-return').value) / 100;
    const mktRisk = parseFloat(document.getElementById('tb-mkt-risk').value) / 100;
    const rf = parseFloat(document.getElementById('tb-rf').value) / 100;
    
    const mktPremium = mktReturn - rf;
    const mktVariance = mktRisk * mktRisk;
    const residualVariance = residualRisk * residualRisk;
    
    // Simplified calculation (assuming beta_A ≈ 1)
    const w0 = (alpha / residualVariance) / (mktPremium / mktVariance);
    const wActive = Math.min(Math.max(w0, 0), 0.5); // Cap at 50%
    const wPassive = 1 - wActive;
    
    const portfolioAlpha = wActive * alpha;
    const expectedReturn = rf + wPassive * mktPremium + portfolioAlpha;
    
    document.getElementById('tbResult').innerHTML = `
        <strong>Optimal Allocation:</strong><br>
        Active Portfolio: ${(wActive * 100).toFixed(1)}%<br>
        Market Index: ${(wPassive * 100).toFixed(1)}%<br>
        <br>
        <strong>Expected Portfolio Return:</strong> ${(expectedReturn * 100).toFixed(2)}%<br>
        <strong>Portfolio Alpha:</strong> ${(portfolioAlpha * 100).toFixed(2)}%<br>
        <br>
        💡 ${wActive > 0.3 ? 
            'High active allocation - you have strong conviction in your alpha!' : 
            wActive > 0.1 ?
            'Moderate active tilt - balanced approach.' :
            'Small active tilt - mostly passive with opportunistic bets.'}
    `;
}

// Update diversification chart
function updateDiversification() {
    const numStocks = parseInt(document.getElementById('stockSlider').value);
    document.getElementById('stockCount').textContent = numStocks;
    
    // Simplified diversification model
    const systematicRisk = 20; // Market risk
    const initialIdiosyncratic = 30; // Starting idiosyncratic risk
    const idiosyncraticRisk = initialIdiosyncratic / Math.sqrt(numStocks);
    const totalRisk = Math.sqrt(systematicRisk * systematicRisk + idiosyncraticRisk * idiosyncraticRisk);
    
    const reductionPct = ((initialIdiosyncratic - idiosyncraticRisk) / initialIdiosyncratic * 100);
    
    document.getElementById('diversificationInsight').innerHTML = `
        💡 <strong>Portfolio Risk:</strong> ${totalRisk.toFixed(1)}% (Systematic: ${systematicRisk}%, Idiosyncratic: ${idiosyncraticRisk.toFixed(1)}%)<br>
        You've eliminated ${reductionPct.toFixed(0)}% of the idiosyncratic risk!
        ${numStocks >= 20 ? ' ✅ Well diversified!' : numStocks >= 10 ? ' Getting there!' : ' Add more stocks to diversify further.'}
    `;
    
    // Update chart
    createDiversificationChart(numStocks);
}

// Chart.js visualizations

// Basic returns chart
window.addEventListener('load', function() {
    const ctx1 = document.getElementById('basicReturnsChart');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Risk-Free Rate', 'Market Return', 'Average Stock', 'Average Fund'],
                datasets: [{
                    label: 'Annualized Return (%)',
                    data: [1.61, 10.02, 9.5, 9.8],
                    backgroundColor: ['#48bb78', '#667eea', '#f6ad55', '#9f7aea']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Average Returns: Swedish Market 2003-2025' }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Return (%)' } }
                }
            }
        });
    }

    // Sharpe ratio comparison
    const ctx2 = document.getElementById('sharpeComparisonChart');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Individual Stocks', 'Investment Funds', 'Market Portfolio'],
                datasets: [{
                    label: 'Sharpe Ratio',
                    data: [0.12, 0.25, 0.136],
                    backgroundColor: ['#f6ad55', '#48bb78', '#667eea']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Risk-Adjusted Performance' }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Sharpe Ratio' } }
                }
            }
        });
    }

    // CML chart
    const ctx3 = document.getElementById('cmlChart');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Capital Market Line',
                        data: [{x: 0, y: 1.61}, {x: 62, y: 10.02}],
                        type: 'line',
                        borderColor: '#667eea',
                        borderWidth: 3,
                        pointRadius: 0
                    },
                    {
                        label: 'Individual Stocks',
                        data: Array.from({length: 20}, () => ({
                            x: Math.random() * 60 + 20,
                            y: Math.random() * 15 + 2
                        })),
                        backgroundColor: '#f6ad55',
                        pointRadius: 6
                    },
                    {
                        label: 'Investment Funds',
                        data: Array.from({length: 10}, () => ({
                            x: Math.random() * 20 + 15,
                            y: Math.random() * 4 + 7
                        })),
                        backgroundColor: '#48bb78',
                        pointRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Stocks vs Funds: Efficiency Analysis' }
                },
                scales: {
                    x: { title: { display: true, text: 'Risk (Standard Deviation %)' } },
                    y: { title: { display: true, text: 'Expected Return (%)' } }
                }
            }
        });
    }

    // Alpha by size
    const ctx4 = document.getElementById('alphaBySize');
    if (ctx4) {
        new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: ['P1 (Smallest)', 'P2', 'P3', 'P4', 'P5 (Largest)'],
                datasets: [{
                    label: 'CAPM Alpha (%)',
                    data: [3.2, 1.5, 0.8, -0.2, -0.5],
                    backgroundColor: ['#48bb78', '#68d391', '#9ae6b4', '#f6ad55', '#fc8181']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Size Effect: Alphas by Portfolio (2016-2025)' }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        title: { display: true, text: 'Alpha (% per year)' }
                    }
                }
            }
        });
    }

    // Factor returns over time (simplified)
    const ctx5 = document.getElementById('factorReturnsChart');
    if (ctx5) {
        new Chart(ctx5, {
            type: 'bar',
            data: {
                labels: ['Market (MKT-RF)', 'Size (SMB)', 'Value (HML)'],
                datasets: [{
                    label: 'Average Annual Return (%)',
                    data: [8.41, 0.87, 2.18],
                    backgroundColor: ['#667eea', '#f6ad55', '#9f7aea']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Fama-French Factor Premiums (2003-2025)' }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Return (%)' } }
                }
            }
        });
    }

    // Fee impact
    const ctx6 = document.getElementById('feeImpactChart');
    if (ctx6) {
        new Chart(ctx6, {
            type: 'bar',
            data: {
                labels: ['Active Fund 1', 'Active Fund 2', 'Index Fund'],
                datasets: [
                    {
                        label: 'Gross Alpha',
                        data: [1.5, 2.2, 0.1],
                        backgroundColor: '#48bb78'
                    },
                    {
                        label: 'Net Alpha',
                        data: [-0.3, 0.4, -0.2],
                        backgroundColor: '#fc8181'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Manager Skill vs Investor Value' }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        title: { display: true, text: 'Alpha (% per year)' }
                    }
                }
            }
        });
    }

    // Initialize diversification chart
    createDiversificationChart(1);
});

// Create diversification chart function
function createDiversificationChart(numStocks) {
    const ctx = document.getElementById('diversificationChart');
    if (!ctx) return;
    
    // Generate data points
    const dataPoints = [];
    for (let i = 1; i <= 50; i++) {
        const systematicRisk = 20;
        const idiosyncraticRisk = 30 / Math.sqrt(i);
        const totalRisk = Math.sqrt(systematicRisk * systematicRisk + idiosyncraticRisk * idiosyncraticRisk);
        dataPoints.push({x: i, y: totalRisk});
    }
    
    // Destroy existing chart if it exists
    if (window.diversificationChart) {
        window.diversificationChart.destroy();
    }
    
    // Create new chart
    window.diversificationChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Total Portfolio Risk',
                    data: dataPoints,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true,
                    pointRadius: 0
                },
                {
                    label: 'Your Portfolio',
                    data: [{x: numStocks, y: dataPoints[numStocks - 1].y}],
                    backgroundColor: '#48bb78',
                    pointRadius: 10,
                    pointStyle: 'star'
                },
                {
                    label: 'Systematic Risk Floor',
                    data: [{x: 1, y: 20}, {x: 50, y: 20}],
                    borderColor: '#fc8181',
                    borderDash: [5, 5],
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Diversification Effect' },
                legend: { display: true }
            },
            scales: {
                x: { 
                    type: 'linear',
                    title: { display: true, text: 'Number of Stocks' },
                    min: 1,
                    max: 50
                },
                y: { 
                    title: { display: true, text: 'Portfolio Risk (%)' },
                    min: 15,
                    max: 40
                }
            }
        }
    });
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
