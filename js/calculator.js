// Asphalt Calculator Core Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all input elements
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const depthInput = document.getElementById('depth');
    const densityInput = document.getElementById('density');
    const costInput = document.getElementById('cost');
    
    // Get all slider elements
    const lengthSlider = document.getElementById('length-slider');
    const widthSlider = document.getElementById('width-slider');
    const depthSlider = document.getElementById('depth-slider');
    const densitySlider = document.getElementById('density-slider');
    const costSlider = document.getElementById('cost-slider');
    
    // Get result elements
    const volumeResult = document.getElementById('volume-result');
    const weightResult = document.getElementById('weight-result');
    const costResult = document.getElementById('cost-result');
    const mixTypeResult = document.getElementById('mix-type');
    
    // Get unit elements
    const unitToggle = document.getElementById('unit-toggle');
    const unitLabels = document.querySelectorAll('.unit-label');
    const volumeUnit = document.getElementById('volume-unit');
    const weightUnit = document.getElementById('weight-unit');
    
    // Get action buttons
    const printBtn = document.getElementById('print-btn');
    const shareBtn = document.getElementById('share-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Default unit state (false = imperial, true = metric)
    let isMetric = false;
    
    // Conversion factors
    const CUBIC_FEET_TO_CUBIC_METERS = 0.0283168;
    const POUNDS_TO_KG = 0.453592;
    const FEET_TO_METERS = 0.3048;
    const INCHES_TO_CM = 2.54;
    
    // Connect sliders to input fields
    function setupSliderInput(slider, input) {
        slider.addEventListener('input', function() {
            input.value = slider.value;
            calculateResults();
        });
        
        input.addEventListener('input', function() {
            slider.value = input.value;
            calculateResults();
        });
    }
    
    // Setup all slider-input pairs
    setupSliderInput(lengthSlider, lengthInput);
    setupSliderInput(widthSlider, widthInput);
    setupSliderInput(depthSlider, depthInput);
    setupSliderInput(densitySlider, densityInput);
    setupSliderInput(costSlider, costInput);
    
    // Calculate asphalt volume, weight, and cost
    function calculateResults() {
        // Get input values
        let length = parseFloat(lengthInput.value) || 0;
        let width = parseFloat(widthInput.value) || 0;
        let depth = parseFloat(depthInput.value) || 0;
        let density = parseFloat(densityInput.value) || 0;
        let costPerTon = parseFloat(costInput.value) || 0;
        
        // Convert depth from inches to feet for imperial calculations
        let depthInFeet = depth / 12;
        
        // Calculate volume in cubic feet (imperial) or cubic meters (metric)
        let volume;
        if (isMetric) {
            // For metric: length (m) * width (m) * depth (cm) / 100 (to convert cm to m)
            volume = length * width * (depth / 100);
        } else {
            // For imperial: length (ft) * width (ft) * depth (ft)
            volume = length * width * depthInFeet;
        }
        
        // Calculate weight
        let weight;
        if (isMetric) {
            // For metric: volume (m³) * density (kg/m³) / 1000 (to convert to metric tons)
            weight = volume * density / 1000;
        } else {
            // For imperial: volume (ft³) * density (lb/ft³) / 2000 (to convert to US tons)
            weight = volume * density / 2000;
        }
        
        // Calculate cost
        let cost = weight * costPerTon;
        
        // Determine suggested mix type based on depth
        let mixType = "Standard Hot Mix Asphalt";
        if (isMetric) {
            if (depth < 4) {
                mixType = "Thin Overlay Mix";
            } else if (depth > 10) {
                mixType = "Heavy-Duty Base Mix";
            }
        } else {
            if (depth < 1.5) {
                mixType = "Thin Overlay Mix";
            } else if (depth > 4) {
                mixType = "Heavy-Duty Base Mix";
            }
        }
        
        // Update results with formatted values
        volumeResult.textContent = volume.toFixed(2);
        weightResult.textContent = weight.toFixed(2);
        costResult.textContent = '$' + cost.toFixed(2);
        mixTypeResult.textContent = mixType;
    }
    
    // Toggle between imperial and metric units
    unitToggle.addEventListener('change', function() {
        isMetric = unitToggle.checked;
        
        // Update unit labels
        if (isMetric) {
            // Update input labels
            unitLabels[0].textContent = 'meters';
            unitLabels[1].textContent = 'meters';
            unitLabels[2].textContent = 'cm';
            unitLabels[3].textContent = 'kg/cubic meter';
            
            // Update result unit labels
            volumeUnit.textContent = 'cubic meters';
            weightUnit.textContent = 'metric tons';
            
            // Convert input values from imperial to metric
            lengthInput.value = (parseFloat(lengthInput.value) * FEET_TO_METERS).toFixed(2);
            widthInput.value = (parseFloat(widthInput.value) * FEET_TO_METERS).toFixed(2);
            depthInput.value = (parseFloat(depthInput.value) * INCHES_TO_CM).toFixed(2);
            densityInput.value = (parseFloat(densityInput.value) * 16.0185).toFixed(0); // Convert lb/ft³ to kg/m³
            
            // Update sliders
            lengthSlider.value = lengthInput.value;
            widthSlider.value = widthInput.value;
            depthSlider.value = depthInput.value;
            densitySlider.value = densityInput.value;
            
            // Update slider ranges for metric
            lengthSlider.min = 0;
            lengthSlider.max = 300; // 300 meters
            widthSlider.min = 0;
            widthSlider.max = 300; // 300 meters
            depthSlider.min = 0;
            depthSlider.max = 60; // 60 cm
            densitySlider.min = 1600;
            densitySlider.max = 3200; // kg/m³
        } else {
            // Update input labels
            unitLabels[0].textContent = 'feet';
            unitLabels[1].textContent = 'feet';
            unitLabels[2].textContent = 'inches';
            unitLabels[3].textContent = 'lbs/cubic foot';
            
            // Update result unit labels
            volumeUnit.textContent = 'cubic feet';
            weightUnit.textContent = 'tons';
            
            // Convert input values from metric to imperial
            lengthInput.value = (parseFloat(lengthInput.value) / FEET_TO_METERS).toFixed(2);
            widthInput.value = (parseFloat(widthInput.value) / FEET_TO_METERS).toFixed(2);
            depthInput.value = (parseFloat(depthInput.value) / INCHES_TO_CM).toFixed(2);
            densityInput.value = (parseFloat(densityInput.value) / 16.0185).toFixed(0); // Convert kg/m³ to lb/ft³
            
            // Update sliders
            lengthSlider.value = lengthInput.value;
            widthSlider.value = widthInput.value;
            depthSlider.value = depthInput.value;
            densitySlider.value = densityInput.value;
            
            // Update slider ranges for imperial
            lengthSlider.min = 0;
            lengthSlider.max = 1000; // 1000 feet
            widthSlider.min = 0;
            widthSlider.max = 1000; // 1000 feet
            depthSlider.min = 0;
            depthSlider.max = 24; // 24 inches
            densitySlider.min = 100;
            densitySlider.max = 200; // lbs/ft³
        }
        
        // Recalculate with new units
        calculateResults();
    });
    
    // Print functionality
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Share functionality
    shareBtn.addEventListener('click', function() {
        // Create a shareable link with current parameters
        const params = new URLSearchParams();
        params.append('length', lengthInput.value);
        params.append('width', widthInput.value);
        params.append('depth', depthInput.value);
        params.append('density', densityInput.value);
        params.append('cost', costInput.value);
        params.append('units', isMetric ? 'metric' : 'imperial');
        
        const shareUrl = window.location.origin + window.location.pathname + '?' + params.toString();
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: 'Asphalt Calculator Results',
                text: `Check out my asphalt calculation: ${volumeResult.textContent} ${volumeUnit.textContent}, ${weightResult.textContent} ${weightUnit.textContent}, Cost: ${costResult.textContent}`,
                url: shareUrl
            })
            .catch(error => {
                console.error('Error sharing:', error);
                fallbackShare(shareUrl);
            });
        } else {
            fallbackShare(shareUrl);
        }
    });
    
    // Fallback share method (copy to clipboard)
    function fallbackShare(url) {
        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        
        // Select and copy the URL
        tempInput.select();
        document.execCommand('copy');
        
        // Remove the temporary input
        document.body.removeChild(tempInput);
        
        // Notify the user
        alert('Link copied to clipboard!');
    }
    
    // Reset functionality
    resetBtn.addEventListener('click', function() {
        // Reset to default values
        lengthInput.value = 10;
        widthInput.value = 10;
        depthInput.value = 2;
        densityInput.value = 145;
        costInput.value = 100;
        
        // Reset sliders
        lengthSlider.value = 10;
        widthSlider.value = 10;
        depthSlider.value = 2;
        densitySlider.value = 145;
        costSlider.value = 100;
        
        // Reset to imperial units if currently metric
        if (isMetric) {
            unitToggle.checked = false;
            isMetric = false;
            
            // Update unit labels
            unitLabels[0].textContent = 'feet';
            unitLabels[1].textContent = 'feet';
            unitLabels[2].textContent = 'inches';
            unitLabels[3].textContent = 'lbs/cubic foot';
            
            // Update result unit labels
            volumeUnit.textContent = 'cubic feet';
            weightUnit.textContent = 'tons';
            
            // Reset slider ranges
            lengthSlider.min = 0;
            lengthSlider.max = 1000;
            widthSlider.min = 0;
            widthSlider.max = 1000;
            depthSlider.min = 0;
            depthSlider.max = 24;
            densitySlider.min = 100;
            densitySlider.max = 200;
        }
        
        // Recalculate with default values
        calculateResults();
    });
    
    // Check URL parameters for shared calculations
    function loadFromUrlParams() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('length') || params.has('width') || params.has('depth')) {
            // Load units first
            if (params.has('units') && params.get('units') === 'metric') {
                unitToggle.checked = true;
                isMetric = true;
                
                // Update unit labels
                unitLabels[0].textContent = 'meters';
                unitLabels[1].textContent = 'meters';
                unitLabels[2].textContent = 'cm';
                unitLabels[3].textContent = 'kg/cubic meter';
                
                // Update result unit labels
                volumeUnit.textContent = 'cubic meters';
                weightUnit.textContent = 'metric tons';
                
                // Update slider ranges
                lengthSlider.min = 0;
                lengthSlider.max = 300;
                widthSlider.min = 0;
                widthSlider.max = 300;
                depthSlider.min = 0;
                depthSlider.max = 60;
                densitySlider.min = 1600;
                densitySlider.max = 3200;
            }
            
            // Load values
            if (params.has('length')) {
                lengthInput.value = params.get('length');
                lengthSlider.value = params.get('length');
            }
            
            if (params.has('width')) {
                widthInput.value = params.get('width');
                widthSlider.value = params.get('width');
            }
            
            if (params.has('depth')) {
                depthInput.value = params.get('depth');
                depthSlider.value = params.get('depth');
            }
            
            if (params.has('density')) {
                densityInput.value = params.get('density');
                densitySlider.value = params.get('density');
            }
            
            if (params.has('cost')) {
                costInput.value = params.get('cost');
                costSlider.value = params.get('cost');
            }
            
            // Calculate with loaded values
            calculateResults();
        }
    }
    
    // Initial calculation
    calculateResults();
    
    // Load from URL if parameters exist
    loadFromUrlParams();
});
