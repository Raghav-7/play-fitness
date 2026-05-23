// Redirect Surge visitors to the new Vercel deployment
if (window.location.hostname.includes('surge.sh')) {
  window.location.replace('https://play-fitness.vercel.app');
}

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // MOBILE NAVIGATION TOGGLE
  // ==========================================
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');

      // Animate hamburger lines
      const spans = menuToggle.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ==========================================
  // BMI & MEMBERSHIP PLANNER CALCULATOR
  // ==========================================
  const weightInput = document.getElementById('weight');
  const heightInput = document.getElementById('height');
  const ageInput = document.getElementById('age');

  // Goal selectors
  const goalButtons = document.querySelectorAll('.goal-selector .btn-select');
  let selectedGoal = 'muscle'; // Default selection

  // Output Elements
  const bmiValEl = document.getElementById('bmi-value');
  const bmiLabelEl = document.getElementById('bmi-label');
  const proteinValEl = document.getElementById('protein-value');

  const recomProgramEl = document.getElementById('recom-program');
  const recomDescEl = document.getElementById('recom-desc');
  const recomIconEl = document.getElementById('recom-icon');
  const whatsappCtaEl = document.getElementById('whatsapp-cta');

  // Programs Database
  const programs = {
    loss: {
      name: "PLAY HIIT & Cardio Shred",
      desc: "Torch calories, build athletic endurance, and sweat it out in our high-intensity, ladies-only cardio zone.",
      icon: "🔥",
      proteinFactor: 1.4
    },
    muscle: {
      name: "PLAY Strength & Hypertrophy",
      desc: "Elite resistance training for women to build lean muscle mass, solid bone density, and excellent posture.",
      icon: "🏋️‍♀️",
      proteinFactor: 1.8
    },
    core: {
      name: "PLAY Barre & Pilates Sculpt",
      desc: "Low-impact high-burn isometric movements, core stabilization sets, and deep dynamic mobility work.",
      icon: "🧘‍♀️",
      proteinFactor: 1.2
    },
    dance: {
      name: "PLAY Zumba & Aerobics Dance",
      desc: "Vibrant high-tempo dance choreography coupled with dynamic aerobics. Dynamic calorie burning in a fun sisterhood zone.",
      icon: "💃",
      proteinFactor: 1.3
    }
  };

  // Switch Goal Handler
  goalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      goalButtons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      selectedGoal = e.target.dataset.goal;
      calculatePlanner();
    });
  });

  // Calculate Logic
  function calculatePlanner() {
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    const age = parseInt(ageInput.value);

    // Guard Clause
    if (!weight || !height || weight <= 0 || height <= 0) {
      return;
    }

    // 1. BMI Calculation: Weight (kg) / (Height (m) ^ 2)
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // Display BMI
    bmiValEl.textContent = bmi.toFixed(1);

    // Set BMI Severity Category & Color Highlight
    let bmiCategory = "";
    if (bmi < 18.5) {
      bmiCategory = "Underweight";
      bmiValEl.style.color = "hsl(195, 100%, 60%)"; // Sky Blue
    } else if (bmi >= 18.5 && bmi < 24.9) {
      bmiCategory = "Normal Range";
      bmiValEl.style.color = "var(--accent-magenta)"; // Signature Magenta
    } else if (bmi >= 25 && bmi < 29.9) {
      bmiCategory = "Overweight";
      bmiValEl.style.color = "hsl(35, 100%, 50%)"; // Orange
    } else {
      bmiCategory = "Obese Range";
      bmiValEl.style.color = "hsl(0, 100%, 65%)"; // Red
    }
    bmiCategory = `${bmiCategory}`;
    bmiLabelEl.textContent = bmiCategory;

    // 2. Protein Target Calculation
    const programData = programs[selectedGoal];
    const proteinFactor = programData.proteinFactor;
    const dailyProtein = Math.round(weight * proteinFactor);
    proteinValEl.textContent = `${dailyProtein}g`;

    // 3. Update Recommendation UI Box
    recomProgramEl.textContent = programData.name;
    recomDescEl.textContent = programData.desc;
    recomIconEl.textContent = programData.icon;

    // 4. Generate WhatsApp Link URL
    // Placeholder phone number (easily editable)
    const phoneNumber = "919999999999";

    // Friendly readable goal name
    let goalText = "";
    if (selectedGoal === 'loss') goalText = "Cardio HIIT & Fat Loss";
    else if (selectedGoal === 'muscle') goalText = "Lean Strength & Hypertrophy";
    else if (selectedGoal === 'core') goalText = "Pilates, Barre & Toning";
    else if (selectedGoal === 'dance') goalText = "Zumba & Aerobics Dance";

    const prefilledMessage =
      `Hi PLAY Women's Fitness Studio! I just used your Fitness Planner mockup. 

My Workout Stats:
- Goal: ${goalText}
- Height: ${height} cm
- Weight: ${weight} kg
- Calculated BMI: ${bmi.toFixed(1)} (${bmiCategory})
- Target Protein: ${dailyProtein}g/day

You recommended the: *${programData.name}* program. 

I would like to activate my Free 1-Day Trial Pass and visit your ladies-only studio on Arunachalam Rd in Saligramam!`;

    // Set absolute link target
    whatsappCtaEl.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(prefilledMessage)}`;
  }

  // Setup Live Input Listening
  if (weightInput && heightInput && ageInput) {
    [weightInput, heightInput, ageInput].forEach(input => {
      input.addEventListener('input', calculatePlanner);
    });

    // Initial Trigger
    calculatePlanner();
  }
});
