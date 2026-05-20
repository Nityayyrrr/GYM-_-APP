import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
    TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────
type Mode = 'bulking' | 'cutting';
type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

interface Meal {
    time: string;
    title: string;
    items: string[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    icon: string;
}

interface DayPlan {
    meals: Meal[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    tip: string;
}

// ─── Days config ──────────────────────────────────────────────────────────────
const DAYS: { key: DayKey; label: string; short: string }[] = [
    { key: 'mon', label: 'Monday', short: 'MON' },
    { key: 'tue', label: 'Tuesday', short: 'TUE' },
    { key: 'wed', label: 'Wednesday', short: 'WED' },
    { key: 'thu', label: 'Thursday', short: 'THU' },
    { key: 'fri', label: 'Friday', short: 'FRI' },
    { key: 'sat', label: 'Saturday', short: 'SAT' },
    { key: 'sun', label: 'Sunday', short: 'SUN' },
];

const JS_TO_KEY: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const todayKey = JS_TO_KEY[new Date().getDay()];

// ─── Diet Data ────────────────────────────────────────────────────────────────
const DIET_PLANS: Record<Mode, Record<DayKey, DayPlan>> = {
    bulking: {
        mon: {
            tip: '💪 Heavy compound day — load carbs for energy, protein for repair.',
            totalCalories: 3200, totalProtein: 200, totalCarbs: 380, totalFat: 80,
            meals: [
                { time: '7:00 AM', title: 'Power Breakfast', icon: '🌅', calories: 620, protein: 40, carbs: 80, fat: 16, items: ['6 egg whites + 2 whole eggs scrambled', 'Oatmeal (100g) with honey & banana', '1 glass whole milk (300ml)', 'Mixed nuts (20g)'] },
                { time: '10:30 AM', title: 'Mid-Morning Fuel', icon: '🥤', calories: 350, protein: 30, carbs: 45, fat: 6, items: ['Whey protein shake (30g protein)', 'White rice cake (2 pcs)', 'Apple'] },
                { time: '1:30 PM', title: 'Muscle Lunch', icon: '☀️', calories: 780, protein: 55, carbs: 95, fat: 18, items: ['Grilled chicken breast (200g)', 'Brown rice (150g cooked)', 'Rajma curry (1 bowl)', 'Salad with olive oil dressing'] },
                { time: '4:30 PM', title: 'Pre-Workout', icon: '⚡', calories: 420, protein: 25, carbs: 65, fat: 6, items: ['Banana + peanut butter (2 tbsp)', 'Dahi (1 cup low-fat)', 'Handful raisins'] },
                { time: '7:30 PM', title: 'Post-Workout', icon: '🏋️', calories: 550, protein: 35, carbs: 70, fat: 10, items: ['Whey + creatine shake', 'White rice (100g)', '2 boiled eggs', 'Coconut water'] },
                { time: '9:30 PM', title: 'Recovery Dinner', icon: '🌙', calories: 480, protein: 15, carbs: 25, fat: 24, items: ['Paneer bhurji (150g)', 'Multigrain roti (2)', 'Dal tadka (1 bowl)', 'Ghee (1 tsp)'] },
            ],
        },
        tue: {
            tip: '💖 Leg day — your biggest muscles need the most fuel. Eat big!',
            totalCalories: 3400, totalProtein: 210, totalCarbs: 410, totalFat: 85,
            meals: [
                { time: '7:00 AM', title: 'Carb-Load Breakfast', icon: '🌅', calories: 680, protein: 42, carbs: 90, fat: 14, items: ['Poha (2 cups) with peanuts & coriander', '4 boiled eggs', 'Banana smoothie with milk (350ml)', 'Almonds (15g)'] },
                { time: '10:30 AM', title: 'Morning Boost', icon: '🥤', calories: 380, protein: 32, carbs: 48, fat: 7, items: ['Greek yogurt (200g)', 'Whey protein (1 scoop)', 'Berries & honey mix'] },
                { time: '1:30 PM', title: 'Leg Day Lunch', icon: '☀️', calories: 820, protein: 58, carbs: 100, fat: 20, items: ['Mutton keema (150g)', 'Jeera rice (200g cooked)', 'Mixed vegetable sabzi', 'Roti (2)', 'Buttermilk (1 glass)'] },
                { time: '4:30 PM', title: 'Pre-Workout Carbs', icon: '⚡', calories: 460, protein: 28, carbs: 68, fat: 8, items: ['Dates (5–6)', 'Peanut butter toast (2 slices whole wheat)', 'Protein shake (half scoop)'] },
                { time: '7:30 PM', title: 'Post-Workout Reload', icon: '🏋️', calories: 580, protein: 38, carbs: 72, fat: 12, items: ['Rice + dal mixed bowl', 'Grilled chicken (150g)', 'Beetroot juice (200ml)', 'Whey shake'] },
                { time: '9:30 PM', title: 'Night Recovery', icon: '🌙', calories: 480, protein: 12, carbs: 32, fat: 24, items: ['Casein / cottage cheese (200g)', 'Handful walnuts', 'Warm turmeric milk (250ml)'] },
            ],
        },
        wed: {
            tip: '💥 Push day — chest & shoulders. Moderate carbs, high protein.',
            totalCalories: 3100, totalProtein: 205, totalCarbs: 360, totalFat: 78,
            meals: [
                { time: '7:00 AM', title: 'Protein Breakfast', icon: '🌅', calories: 600, protein: 45, carbs: 68, fat: 16, items: ['Moong dal chilla (3 pcs) with green chutney', 'Hung curd dip', '3 whole eggs omelette', 'Seasonal fruit bowl'] },
                { time: '10:30 AM', title: 'Morning Shake', icon: '🥤', calories: 320, protein: 30, carbs: 38, fat: 6, items: ['Whey protein shake with oats blended (250ml milk)', 'Orange'] },
                { time: '1:30 PM', title: 'Power Lunch', icon: '☀️', calories: 760, protein: 55, carbs: 88, fat: 18, items: ['Fish curry — rohu/surmai (200g)', 'Brown rice (150g cooked)', 'Palak sabzi', 'Roti (1)', 'Salad'] },
                { time: '4:30 PM', title: 'Pre-Workout', icon: '⚡', calories: 400, protein: 22, carbs: 60, fat: 7, items: ['Oats bar (homemade / store)', 'Low-fat dahi (100g)', 'Black coffee (no sugar)'] },
                { time: '7:30 PM', title: 'Post-Workout', icon: '🏋️', calories: 540, protein: 38, carbs: 66, fat: 10, items: ['Whey + dextrose shake', 'Egg white sandwich (3 whites, multigrain)', 'Sweet potato (100g baked)'] },
                { time: '9:30 PM', title: 'Dinner', icon: '🌙', calories: 480, protein: 15, carbs: 40, fat: 21, items: ['Soya chunk curry (1 bowl)', 'Multigrain roti (2)', 'Mixed dal', 'Ghee (1 tsp)'] },
            ],
        },
        thu: {
            tip: '🔙 Pull day — back & biceps. Keep protein high, carbs moderate.',
            totalCalories: 3150, totalProtein: 208, totalCarbs: 368, totalFat: 79,
            meals: [
                { time: '7:00 AM', title: 'Strong Start', icon: '🌅', calories: 640, protein: 44, carbs: 78, fat: 14, items: ['Upma (1.5 cups) with cashews & veggies', '4 boiled eggs (2 whole + 2 whites)', 'Mango lassi (1 glass)', 'Peanuts (20g)'] },
                { time: '10:30 AM', title: 'Mid Snack', icon: '🥤', calories: 330, protein: 28, carbs: 42, fat: 7, items: ['Protein bar (20g+ protein)', 'Apple', 'Water (500ml)'] },
                { time: '1:30 PM', title: 'Bulk Lunch', icon: '☀️', calories: 790, protein: 58, carbs: 94, fat: 19, items: ['Egg curry (3 eggs)', 'White rice (200g cooked)', 'Sarson ka saag or green sabzi', 'Roti (2)', 'Raita (1 bowl)'] },
                { time: '4:30 PM', title: 'Pre-Workout Hit', icon: '⚡', calories: 420, protein: 26, carbs: 62, fat: 7, items: ['Banana + almond butter (1.5 tbsp)', 'Quick oats with milk', 'Pre-workout supplement (optional)'] },
                { time: '7:30 PM', title: 'Post Pump', icon: '🏋️', calories: 510, protein: 38, carbs: 60, fat: 8, items: ['Whey protein shake', 'Boiled chicken (150g)', 'White rice (100g)', 'Coconut water (300ml)'] },
                { time: '9:30 PM', title: 'Night Meal', icon: '🌙', calories: 460, protein: 14, carbs: 32, fat: 24, items: ['Paneer paratha (2 small)', 'Dahi (1 cup)', 'Cucumber salad', 'Warm milk (250ml)'] },
            ],
        },
        fri: {
            tip: '🔥 High-intensity day — refuel aggressively. Best day for clean-treat meal.',
            totalCalories: 3300, totalProtein: 212, totalCarbs: 395, totalFat: 82,
            meals: [
                { time: '7:00 AM', title: 'Big Breakfast', icon: '🌅', calories: 660, protein: 44, carbs: 82, fat: 16, items: ['Masala omelette (3 eggs, capsicum & onion)', 'Brown bread toast (3 slices)', 'Banana milkshake (300ml)', 'Mixed nuts (20g)'] },
                { time: '10:30 AM', title: 'Shake & Snack', icon: '🥤', calories: 360, protein: 32, carbs: 45, fat: 7, items: ['Whey protein shake (30g)', 'Watermelon / muskmelon (1 bowl)', 'Black coffee'] },
                { time: '1:30 PM', title: 'Friday Lunch', icon: '☀️', calories: 800, protein: 56, carbs: 98, fat: 20, items: ['Chicken biryani (300g)', 'Raita (1 bowl)', 'Fresh salad', 'Nimbu paani'] },
                { time: '4:30 PM', title: 'Pre-Workout', icon: '⚡', calories: 440, protein: 28, carbs: 65, fat: 8, items: ['Peanut butter + banana smoothie (milk based)', 'Dahi (small bowl)', 'Energy chew / banana'] },
                { time: '7:30 PM', title: 'Post-Workout', icon: '🏋️', calories: 560, protein: 38, carbs: 72, fat: 10, items: ['Whey + creatine shake', 'Chicken sandwich (whole wheat, 2 slices)', 'Baked sweet potato fries (100g)'] },
                { time: '9:30 PM', title: 'Recovery Dinner', icon: '🌙', calories: 480, protein: 14, carbs: 33, fat: 21, items: ['Mixed dal khichdi (1 big bowl)', 'Papad + pickle', 'Ghee (1 tsp)', 'Warm doodh (250ml)'] },
            ],
        },
        sat: {
            tip: '🏟️ Active rest / sport day — lighter training, moderate fuel, enjoy food.',
            totalCalories: 3000, totalProtein: 190, totalCarbs: 350, totalFat: 80,
            meals: [
                { time: '8:00 AM', title: 'Weekend Breakfast', icon: '🌅', calories: 580, protein: 38, carbs: 72, fat: 16, items: ['Besan chilla (3) with paneer stuffing', 'Green chutney', 'Fresh fruit juice (1 glass)', '2 boiled eggs'] },
                { time: '11:00 AM', title: 'Brunch Shake', icon: '🥤', calories: 350, protein: 30, carbs: 44, fat: 7, items: ['Protein smoothie — banana + whey + milk (350ml)', 'Handful almonds'] },
                { time: '2:00 PM', title: 'Hearty Lunch', icon: '☀️', calories: 780, protein: 52, carbs: 88, fat: 22, items: ['Grilled fish or chicken (200g)', 'Rajma rice or pulao (200g cooked)', 'Salad (cucumber, tomato, onion)', 'Dahi (1 bowl)'] },
                { time: '5:00 PM', title: 'Evening Snack', icon: '⚡', calories: 380, protein: 24, carbs: 50, fat: 8, items: ['Roasted chana + peanuts mix (50g)', 'Seasonal fruit', 'Coconut water or lemon water'] },
                { time: '8:00 PM', title: 'Dinner', icon: '🌙', calories: 550, protein: 20, carbs: 56, fat: 22, items: ['Homestyle egg / chicken fried rice (200g)', 'Tomato or lentil soup', 'Raita', 'Multigrain roti (1)'] },
                { time: '10:00 PM', title: 'Night Fuel', icon: '💤', calories: 360, protein: 26, carbs: 40, fat: 5, items: ['Cottage cheese (100g) + honey drizzle', 'Warm milk with ashwagandha (250ml)'] },
            ],
        },
        sun: {
            tip: '😴 Rest & rebuild — clean eating, no heavy session. Let the body repair.',
            totalCalories: 2800, totalProtein: 180, totalCarbs: 310, totalFat: 75,
            meals: [
                { time: '8:30 AM', title: 'Lazy Sunday Breakfast', icon: '🌅', calories: 540, protein: 36, carbs: 62, fat: 16, items: ['Dosa (2) with sambar & coconut chutney', '3 boiled eggs', 'Fresh lime water', 'Papaya (1 bowl)'] },
                { time: '11:30 AM', title: 'Morning Snack', icon: '🥤', calories: 310, protein: 26, carbs: 38, fat: 6, items: ['Greek yogurt (200g) + chia seeds + mixed fruits', 'Herbal or green tea'] },
                { time: '2:30 PM', title: 'Sunday Lunch', icon: '☀️', calories: 720, protein: 48, carbs: 82, fat: 20, items: ['Ghee dal tadka (1 bowl)', 'Steamed rice (150g cooked)', 'Aloo gobhi sabzi', 'Roti (2)', 'Pickle'] },
                { time: '5:30 PM', title: 'Evening', icon: '☕', calories: 340, protein: 20, carbs: 42, fat: 8, items: ['Peanut butter on multigrain toast (2 slices)', 'Banana', 'Chai (low sugar) or black coffee'] },
                { time: '8:30 PM', title: 'Light Dinner', icon: '🌙', calories: 560, protein: 30, carbs: 56, fat: 18, items: ['Homestyle chicken soup (1 big bowl)', 'Multigrain roti (2)', 'Sautéed spinach / broccoli', 'Dahi (1 cup)'] },
                { time: '10:30 PM', title: 'Bedtime', icon: '💤', calories: 330, protein: 20, carbs: 30, fat: 7, items: ['Warm turmeric milk (300ml)', 'Soaked almonds (8–10)', 'Casein / cottage cheese (optional, 80g)'] },
            ],
        },
    },
    cutting: {
        mon: {
            tip: '🔥 Deficit Monday — high protein to guard muscle, low carbs. Hydrate!',
            totalCalories: 1800, totalProtein: 185, totalCarbs: 140, totalFat: 48,
            meals: [
                { time: '7:00 AM', title: 'Lean Breakfast', icon: '🌅', calories: 340, protein: 38, carbs: 28, fat: 8, items: ['5 egg whites + 1 whole egg omelette (non-stick, no oil)', 'Multigrain toast (1 slice)', 'Black coffee / green tea', 'Cucumber + tomato salad'] },
                { time: '10:30 AM', title: 'Protein Snack', icon: '🥤', calories: 180, protein: 28, carbs: 10, fat: 3, items: ['Whey protein shake (water-based)', 'Green apple'] },
                { time: '1:30 PM', title: 'Shredding Lunch', icon: '☀️', calories: 420, protein: 48, carbs: 38, fat: 10, items: ['Grilled chicken breast (200g)', 'Steamed brown rice (80g cooked)', 'Mixed veg stir-fry (no oil)', 'Lemon water'] },
                { time: '4:30 PM', title: 'Pre-Workout', icon: '⚡', calories: 160, protein: 22, carbs: 18, fat: 2, items: ['Low-carb protein bar (<15g carbs)', 'Black coffee (no sugar)', 'Water (500ml)'] },
                { time: '7:30 PM', title: 'Post-Workout', icon: '🏋️', calories: 280, protein: 32, carbs: 28, fat: 4, items: ['Whey protein shake', 'Small banana', 'Coconut water (250ml)'] },
                { time: '9:30 PM', title: 'Light Dinner', icon: '🌙', calories: 420, protein: 17, carbs: 18, fat: 21, items: ['Grilled fish (150g) or tofu (200g)', 'Sautéed spinach / broccoli (no oil)', 'Thin dal soup (1 bowl)', 'Big salad with lemon dressing'] },
            ],
        },
        tue: {
            tip: '🥦 Low-carb Tuesday — veggie-heavy, protein-dense. Zero sugar!',
            totalCalories: 1750, totalProtein: 182, totalCarbs: 130, totalFat: 46,
            meals: [
                { time: '7:00 AM', title: 'Veggie Omelette', icon: '🌅', calories: 310, protein: 36, carbs: 14, fat: 12, items: ['4 egg whites + 1 yolk omelette with capsicum, onion, spinach', 'Green tea (no sugar)', 'Sprouted moong (small bowl)'] },
                { time: '10:30 AM', title: 'Mid Snack', icon: '🥤', calories: 150, protein: 25, carbs: 9, fat: 2, items: ['Whey shake (water-based, 25g)', 'Cucumber sticks with lemon'] },
                { time: '1:30 PM', title: 'Cutting Lunch', icon: '☀️', calories: 440, protein: 46, carbs: 40, fat: 10, items: ['Tuna or chicken salad bowl (200g protein)', 'Quinoa (50g dry weight cooked)', 'Olive oil + lemon dressing (1 tsp oil only)', 'Steamed carrots & beans'] },
                { time: '4:30 PM', title: 'Pre-Workout', icon: '⚡', calories: 160, protein: 20, carbs: 18, fat: 2, items: ['Low-fat Greek yogurt (100g)', 'Black coffee', 'Half banana'] },
                { time: '7:30 PM', title: 'Post-Workout', icon: '🏋️', calories: 260, protein: 30, carbs: 24, fat: 4, items: ['Whey shake', 'Rice cakes (2)', 'Coconut water (200ml)'] },
                { time: '9:30 PM', title: 'Night Meal', icon: '🌙', calories: 430, protein: 25, carbs: 25, fat: 16, items: ['Moong dal soup (1 bowl)', 'Low-fat paneer (80g) + steamed broccoli', 'Big salad', 'Warm lemon water'] },
            ],
        },
        wed: {
            tip: '⚖️ Mid-week mini refeed — slightly more carbs, push hard in the gym.',
            totalCalories: 1900, totalProtein: 190, totalCarbs: 170, totalFat: 46,
            meals: [
                { time: '7:00 AM', title: 'Refeed Breakfast', icon: '🌅', calories: 380, protein: 40, carbs: 40, fat: 8, items: ['Oats (60g) cooked in water / skim milk', '4 egg whites scrambled', 'Green tea', 'Half banana'] },
                { time: '10:30 AM', title: 'Morning Protein', icon: '🥤', calories: 180, protein: 28, carbs: 14, fat: 2, items: ['Whey shake (water)', 'Orange or apple'] },
                { time: '1:30 PM', title: 'Refeed Lunch', icon: '☀️', calories: 480, protein: 50, carbs: 52, fat: 8, items: ['Grilled chicken (200g)', 'Baked sweet potato (100g)', 'Mixed greens salad', 'Lemon + olive oil dressing (minimal)'] },
                { time: '4:30 PM', title: 'Pre-Workout', icon: '⚡', calories: 200, protein: 22, carbs: 26, fat: 2, items: ['Rice cakes (3) with peanut butter (1 tsp)', 'Black coffee'] },
                { time: '7:30 PM', title: 'Post-Workout', icon: '🏋️', calories: 300, protein: 34, carbs: 30, fat: 4, items: ['Whey + creatine shake', 'Banana', 'Coconut water (300ml)'] },
                { time: '9:30 PM', title: 'Dinner', icon: '🌙', calories: 360, protein: 16, carbs: 8, fat: 22, items: ['Egg bhurji (3 eggs, minimal oil)', 'Thin vegetable soup', 'Big salad', '1 multigrain roti'] },
            ],
        },
        thu: {
            tip: '💧 High water day — flush, keep protein high, minimise sodium.',
            totalCalories: 1780, totalProtein: 186, totalCarbs: 138, totalFat: 45,
            meals: [
                { time: '7:00 AM', title: 'Clean Breakfast', icon: '🌅', calories: 320, protein: 38, carbs: 22, fat: 8, items: ['Moong dal chilla (2, no-oil non-stick)', 'Green chutney', '3 egg whites boiled', 'Warm lemon water'] },
                { time: '10:30 AM', title: 'Protein Hit', icon: '🥤', calories: 160, protein: 26, carbs: 10, fat: 2, items: ['Whey shake (water)', 'Celery / cucumber sticks'] },
                { time: '1:30 PM', title: 'Lean Lunch', icon: '☀️', calories: 430, protein: 46, carbs: 40, fat: 9, items: ['Baked / grilled fish (200g)', 'Brown rice (70g cooked)', 'Steamed vegetables (no butter)', 'Thin lentil soup'] },
                { time: '4:30 PM', title: 'Pre-Workout', icon: '⚡', calories: 160, protein: 18, carbs: 18, fat: 2, items: ['Low-fat Greek yogurt (100g)', 'Black coffee', 'Small apple'] },
                { time: '7:30 PM', title: 'Post-Workout', icon: '🏋️', calories: 270, protein: 32, carbs: 24, fat: 4, items: ['Whey shake', 'Rice cakes (2)', 'Water (500ml)'] },
                { time: '9:30 PM', title: 'Night Meal', icon: '🌙', calories: 440, protein: 26, carbs: 24, fat: 20, items: ['Tofu stir-fry (200g, minimal oil)', 'Steamed palak', 'Thin dal soup (1 bowl)', 'Salad'] },
            ],
        },
        fri: {
            tip: '🎯 Finish strong — stay disciplined today. Do NOT cheat!',
            totalCalories: 1820, totalProtein: 188, totalCarbs: 145, totalFat: 46,
            meals: [
                { time: '7:00 AM', title: 'Focus Breakfast', icon: '🌅', calories: 340, protein: 40, carbs: 28, fat: 8, items: ['5 egg whites + 1 whole egg scrambled', 'Multigrain toast (1 slice)', 'Green tea', 'Kiwi or papaya (1 bowl)'] },
                { time: '10:30 AM', title: 'Protein Shake', icon: '🥤', calories: 170, protein: 27, carbs: 12, fat: 2, items: ['Whey protein (water-based, 27g)', 'Apple'] },
                { time: '1:30 PM', title: 'Lean Friday Lunch', icon: '☀️', calories: 440, protein: 48, carbs: 44, fat: 9, items: ['Grilled chicken (200g)', 'Quinoa (60g dry cooked)', 'Big salad bowl', 'Olive oil + apple cider vinegar dressing'] },
                { time: '4:30 PM', title: 'Pre-Workout', icon: '⚡', calories: 170, protein: 20, carbs: 20, fat: 2, items: ['Low-carb protein bar', 'Black coffee', 'Water (500ml)'] },
                { time: '7:30 PM', title: 'Post-Workout', icon: '🏋️', calories: 280, protein: 32, carbs: 26, fat: 4, items: ['Whey shake', 'Half banana', 'Coconut water (250ml)'] },
                { time: '9:30 PM', title: 'Light Dinner', icon: '🌙', calories: 420, protein: 21, carbs: 15, fat: 21, items: ['Baked fish or tofu (150g)', 'Sautéed spinach + mushroom (no oil)', 'Dal shorba (1 bowl)', 'Salad'] },
            ],
        },
        sat: {
            tip: '🧘 Weekend discipline — one small treat allowed but stay in deficit!',
            totalCalories: 1900, totalProtein: 186, totalCarbs: 160, totalFat: 50,
            meals: [
                { time: '8:00 AM', title: 'Lazy Clean Start', icon: '🌅', calories: 360, protein: 38, carbs: 32, fat: 10, items: ['Besan chilla (2, no oil)', 'Low-fat curd (100g)', 'Green chutney', 'Warm lemon water'] },
                { time: '11:00 AM', title: 'Brunch Shake', icon: '🥤', calories: 170, protein: 26, carbs: 14, fat: 2, items: ['Whey + water shake (26g protein)', 'Handful sprouted moong'] },
                { time: '2:00 PM', title: 'Saturday Lunch', icon: '☀️', calories: 480, protein: 48, carbs: 50, fat: 10, items: ['Grilled chicken or paneer salad bowl (200g)', 'Brown rice (80g cooked)', 'Salad + light dressing', 'Nimbu paani'] },
                { time: '5:00 PM', title: 'Evening Snack', icon: '⚡', calories: 180, protein: 20, carbs: 20, fat: 3, items: ['Roasted chana (30g)', 'Greek yogurt (100g)', 'Green tea'] },
                { time: '8:00 PM', title: 'Dinner', icon: '🌙', calories: 480, protein: 28, carbs: 30, fat: 20, items: ['Grilled fish (150g)', 'Vegetable soup (thin)', 'Multigrain roti (1)', 'Salad'] },
                { time: '10:00 PM', title: 'Night Snack', icon: '💤', calories: 230, protein: 26, carbs: 14, fat: 5, items: ['Low-fat cottage cheese (100g)', 'Warm herbal tea'] },
            ],
        },
        sun: {
            tip: '🌿 Rest day — lowest calories of week. Lots of water, lots of greens.',
            totalCalories: 1650, totalProtein: 175, totalCarbs: 120, totalFat: 44,
            meals: [
                { time: '8:30 AM', title: 'Gentle Breakfast', icon: '🌅', calories: 300, protein: 34, carbs: 24, fat: 8, items: ['Moong dal khichdi (small bowl, thin consistency)', '3 egg whites boiled', 'Warm lemon ginger water', 'Papaya (1 bowl)'] },
                { time: '11:30 AM', title: 'Light Snack', icon: '🥤', calories: 150, protein: 22, carbs: 10, fat: 2, items: ['Whey shake (water, 22g)', 'Cucumber + lemon'] },
                { time: '2:30 PM', title: 'Sunday Light Lunch', icon: '☀️', calories: 400, protein: 42, carbs: 38, fat: 9, items: ['Grilled chicken breast (180g)', 'Big salad (no dressing)', 'Thin vegetable soup', 'Lemon water'] },
                { time: '5:30 PM', title: 'Evening', icon: '☕', calories: 160, protein: 18, carbs: 16, fat: 2, items: ['Greek yogurt (100g)', 'Green apple', 'Green tea'] },
                { time: '8:30 PM', title: 'Light Dinner', icon: '🌙', calories: 420, protein: 38, carbs: 22, fat: 18, items: ['Steamed fish (150g) or tofu (200g)', 'Palak soup (1 bowl)', 'Salad', 'Warm turmeric water'] },
                { time: '10:30 PM', title: 'Bedtime', icon: '💤', calories: 220, protein: 21, carbs: 10, fat: 5, items: ['Casein or cottage cheese (80g)', 'Warm water'] },
            ],
        },
    },
};

// ─── MacroChip (With Count-Up Animation Logic) ────────────────────────────────
function MacroChip({
    label, value, unit, color,
}: { label: string; value: number; unit: string; color: string }) {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        animatedValue.setValue(0);
        Animated.timing(animatedValue, {
            toValue: value,
            duration: 500,
            useNativeDriver: false, // Required for layout/text updates
        }).start();

        const listenerId = animatedValue.addListener(({ value: latestValue }) => {
            setDisplayValue(Math.floor(latestValue));
        });

        return () => animatedValue.removeListener(listenerId);
    }, [value]);

    return (
        <View style={[chipS.wrap, { borderColor: color + '40', backgroundColor: color + '12' }]}>
            <Text style={[chipS.value, { color }]}>
                {displayValue}
                <Text style={chipS.unit}>{unit}</Text>
            </Text>
            <Text style={chipS.label}>{label}</Text>
        </View>
    );
}

// ─── MealCard (Upgraded with Spring & Scale Entry) ────────────────────────────
function MealCard({
    meal, index, accent,
}: { meal: Meal; index: number; accent: string }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(35)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(35);
        scaleAnim.setValue(0.92);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 60,
                useNativeDriver: true
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 40,
                friction: 7,
                delay: index * 60,
                useNativeDriver: true
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 40,
                friction: 7,
                delay: index * 60,
                useNativeDriver: true
            }),
        ]).start();
    }, [meal.title]);

    return (
        <Animated.View style={[
            cardS.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }
        ]}>
            <View style={[cardS.strip, { backgroundColor: accent }]} />
            <View style={cardS.body}>
                {/* Header */}
                <View style={cardS.header}>
                    <View style={cardS.headerLeft}>
                        <Text style={cardS.icon}>{meal.icon}</Text>
                        <View>
                            <Text style={cardS.title}>{meal.title}</Text>
                            <Text style={cardS.time}>{meal.time}</Text>
                        </View>
                    </View>
                    <View style={[cardS.calBadge, { backgroundColor: accent + '18', borderColor: accent + '35' }]}>
                        <Text style={[cardS.calVal, { color: accent }]}>{meal.calories}</Text>
                        <Text style={[cardS.calUnit, { color: accent }]}>kcal</Text>
                    </View>
                </View>

                {/* Items */}
                <View style={cardS.itemsWrap}>
                    {meal.items.map((item, i) => (
                        <View key={i} style={cardS.itemRow}>
                            <View style={[cardS.dot, { backgroundColor: accent }]} />
                            <Text style={cardS.itemText}>{item}</Text>
                        </View>
                    ))}
                </View>

                {/* Macro strip */}
                <View style={cardS.macroRow}>
                    <Text style={[cardS.macroKey, { color: '#d4541a' }]}>P <Text style={cardS.macroVal}>{meal.protein}g</Text></Text>
                    <Text style={cardS.sep}>·</Text>
                    <Text style={[cardS.macroKey, { color: '#2563a8' }]}>C <Text style={cardS.macroVal}>{meal.carbs}g</Text></Text>
                    <Text style={cardS.sep}>·</Text>
                    <Text style={[cardS.macroKey, { color: '#7c3aed' }]}>F <Text style={cardS.macroVal}>{meal.fat}g</Text></Text>
                </View>
            </View>
        </Animated.View>
    );
}

// ─── DietScreen ───────────────────────────────────────────────────────────────
interface DietScreenProps {
    onBack?: () => void;
}

export default function DietScreen({ onBack }: DietScreenProps) {
    const insets = useSafeAreaInsets();
    const scrollRef = useRef<ScrollView>(null);

    const [mode, setMode] = useState<Mode>('bulking');
    const [selDay, setSelDay] = useState<DayKey>(todayKey);

    // Dynamic Animation Containers
    const toggleAnim = useRef(new Animated.Value(0)).current;
    const badgeScale = useRef(new Animated.Value(1)).current;
    const contentContainerScale = useRef(new Animated.Value(1)).current;
    const tipSlideAnim = useRef(new Animated.Value(-150)).current;

    // Staggered Mount Array for Day Chips
    const dayAnimations = useRef(DAYS.map(() => new Animated.Value(0))).current;

    const accent = mode === 'bulking' ? '#800000' : '#1a6b3c';
    const accentLight = mode === 'bulking' ? '#fff0eb' : '#edfbf3';
    const plan = DIET_PLANS[mode][selDay];

    // Day Chips Entry Animation on mount
    useEffect(() => {
        const entryAnimations = dayAnimations.map((anim, index) => {
            return Animated.spring(anim, {
                toValue: 1,
                tension: 40,
                friction: 6,
                delay: index * 40,
                useNativeDriver: true,
            });
        });
        Animated.parallel(entryAnimations).start();
    }, []);

    // Tip Box Entry Reset when Day or Mode transitions
    useEffect(() => {
        tipSlideAnim.setValue(-100);
        Animated.spring(tipSlideAnim, {
            toValue: 0,
            tension: 30,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, [selDay, mode]);

    const handleMode = (m: Mode) => {
        if (m === mode) return;

        // Perform Pop/Pulse scaling animations on state switch
        Animated.parallel([
            Animated.spring(toggleAnim, {
                toValue: m === 'bulking' ? 0 : 1,
                speed: 14,
                bounciness: 5,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(badgeScale, { toValue: 1.25, duration: 120, useNativeDriver: true }),
                Animated.spring(badgeScale, { toValue: 1, friction: 4, useNativeDriver: true })
            ]),
            Animated.sequence([
                Animated.timing(contentContainerScale, { toValue: 0.97, duration: 100, useNativeDriver: true }),
                Animated.spring(contentContainerScale, { toValue: 1, friction: 6, useNativeDriver: true })
            ])
        ]).start();

        setMode(m);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    const handleDay = (d: DayKey) => {
        setSelDay(d);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    const toggleHalfW = (SCREEN_WIDTH - 48) / 2;
    const pillX = toggleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [2, toggleHalfW],
    });

    return (
        <View style={[scr.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* ──── HEADER ──── */}
            <View style={scr.header}>
                <View style={scr.headerRow}>
                    <View>
                        <Text style={scr.eyebrow}>INSTRUCTOR'S PLAN</Text>
                        <Text style={scr.title}>Weekly Diet</Text>
                    </View>
                    <Animated.View style={[scr.modeBadge, { backgroundColor: accent, transform: [{ scale: badgeScale }] }]}>
                        <Text style={scr.modeBadgeText}>
                            {mode === 'bulking' ? '🔺 BULK' : '🔻 CUT'}
                        </Text>
                    </Animated.View>
                </View>

                {/* Toggle Track */}
                <View style={tog.track}>
                    <Animated.View
                        style={[tog.pill, { width: toggleHalfW - 2, backgroundColor: accent, transform: [{ translateX: pillX }] }]}
                    />
                    <TouchableOpacity style={tog.btn} onPress={() => handleMode('bulking')} activeOpacity={0.85}>
                        <Text style={[tog.label, mode === 'bulking' && tog.labelOn]}>💪  Bulking</Text>
                        <Text style={[tog.sub, mode === 'bulking' && tog.subOn]}>Muscle Gain</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tog.btn} onPress={() => handleMode('cutting')} activeOpacity={0.85}>
                        <Text style={[tog.label, mode === 'cutting' && tog.labelOn]}>🔥  Cutting</Text>
                        <Text style={[tog.sub, mode === 'cutting' && tog.subOn]}>Fat Loss</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ──── DAY SELECTOR ──── */}
            <View style={dayS.wrap}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={dayS.inner}>
                    {DAYS.map((d, index) => {
                        const isActive = d.key === selDay;
                        const scaleIn = dayAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.4, 1]
                        });

                        return (
                            <Animated.View key={d.key} style={{ transform: [{ scale: scaleIn }] }}>
                                <TouchableOpacity
                                    onPress={() => handleDay(d.key)}
                                    activeOpacity={0.75}
                                    style={[
                                        dayS.chip,
                                        isActive && {
                                            backgroundColor: accent,
                                            shadowColor: accent, shadowOpacity: 0.4,
                                            shadowRadius: 8, elevation: 6,
                                        },
                                    ]}
                                >
                                    <Text style={[dayS.chipTxt, isActive && dayS.chipTxtOn]}>{d.short}</Text>
                                    {/* CHANGED: The dot now follows the isActive state so it moves with your selection */}
                                    {isActive && (
                                        <View style={[dayS.dot, { backgroundColor: '#fff' }]} />
                                    )}
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </ScrollView>
            </View>

            {/* ──── CONTENT CONTAINER ──── */}
            <Animated.View style={{ flex: 1, transform: [{ scale: contentContainerScale }] }}>
                <ScrollView
                    ref={scrollRef}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
                >
                    {/* Tip box */}
                    <Animated.View style={[
                        sum.tipBox,
                        { backgroundColor: accentLight, borderLeftColor: accent, transform: [{ translateX: tipSlideAnim }] }
                    ]}>
                        <Text style={sum.tipIcon}>💡</Text>
                        <Text style={[sum.tipText, { color: accent }]}>{plan.tip}</Text>
                    </Animated.View>

                    {/* Daily totals */}
                    <View style={sum.totalsRow}>
                        <MacroChip label="Calories" value={plan.totalCalories} unit=" kcal" color="#d4541a" />
                        <MacroChip label="Protein" value={plan.totalProtein} unit="g" color={accent} />
                        <MacroChip label="Carbs" value={plan.totalCarbs} unit="g" color="#2563a8" />
                        <MacroChip label="Fat" value={plan.totalFat} unit="g" color="#7c3aed" />
                    </View>

                    {/* Coach badge */}
                    <View style={sum.coachRow}>
                        <Text style={sum.coachAvatar}>👨‍🏫</Text>
                        <View>
                            <Text style={sum.coachName}>Coach Vikram</Text>
                            <Text style={sum.coachNote}>
                                {DAYS.find(d => d.key === selDay)?.label}'s plan · {plan.meals.length} meals · Repeats every week
                            </Text>
                        </View>
                    </View>

                    {/* Meal Cards */}
                    <View style={{ paddingHorizontal: 16, gap: 12 }}>
                        {plan.meals.map((meal, i) => (
                            <MealCard
                                key={`${mode}-${selDay}-${i}`}
                                meal={meal}
                                index={i}
                                accent={accent}
                            />
                        ))}
                    </View>

                    {/* Footer */}
                    <View style={sum.footer}>
                        <Text style={sum.footerText}>
                            🔁 This plan repeats every {DAYS.find(d => d.key === selDay)?.label}.{'\n'}
                            Drink 3–4 L water daily · Adjust portions with your coach.
                        </Text>
                    </View>
                </ScrollView>
            </Animated.View>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const scr = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#faf8f5' },
    header: {
        paddingHorizontal: 20, paddingBottom: 14, backgroundColor: '#fff',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, paddingTop: 6 },
    eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.8, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 2 },
    title: { fontSize: 26, fontWeight: '900', color: '#1a1a1a', letterSpacing: -0.5 },
    modeBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    modeBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
});

const tog = StyleSheet.create({
    track: {
        flexDirection: 'row', height: 54, backgroundColor: '#f0eeea',
        borderRadius: 14, position: 'relative', overflow: 'hidden',
    },
    pill: { position: 'absolute', top: 2, bottom: 2, borderRadius: 12 },
    btn: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    label: { fontSize: 13, fontWeight: '700', color: '#6b7280' },
    labelOn: { color: '#fff' },
    sub: { fontSize: 10, fontWeight: '600', color: '#9ca3af', marginTop: 1 },
    subOn: { color: 'rgba(255,255,255,0.82)' },
});

const dayS = StyleSheet.create({
    wrap: { backgroundColor: '#fff', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ede8e2' },
    inner: { paddingHorizontal: 14, gap: 8 },
    chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0eeea', alignItems: 'center' },
    chipTxt: { fontSize: 11, fontWeight: '800', color: '#6b7280', letterSpacing: 1 },
    chipTxtOn: { color: '#fff' },
    dot: { width: 5, height: 5, borderRadius: 3, marginTop: 3 },
});

const sum = StyleSheet.create({
    tipBox: { marginHorizontal: 16, marginTop: 14, marginBottom: 4, padding: 12, borderRadius: 10, borderLeftWidth: 3, flexDirection: 'row', alignItems: 'flex-start', gap: 8, overflow: 'hidden' },
    tipIcon: { fontSize: 16, marginTop: 1 },
    tipText: { flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 19 },
    totalsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginVertical: 12 },
    coachRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 14, gap: 10 },
    coachAvatar: { fontSize: 32 },
    coachName: { fontSize: 14, fontWeight: '800', color: '#1a1a1a' },
    coachNote: { fontSize: 12, color: '#6b7280', marginTop: 1 },
    footer: { marginHorizontal: 16, marginTop: 18, padding: 14, backgroundColor: '#f0eeea', borderRadius: 10 },
    footerText: { fontSize: 12, color: '#6b7280', textAlign: 'center', lineHeight: 18 },
});

const chipS = StyleSheet.create({
    wrap: { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 8, alignItems: 'center' },
    value: { fontSize: 15, fontWeight: '900' },
    unit: { fontSize: 10, fontWeight: '600' },
    label: { fontSize: 9, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
});

const cardS = StyleSheet.create({
    card: {
        flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07, shadowRadius: 8, elevation: 3, overflow: 'hidden',
    },
    strip: { width: 4 },
    body: { flex: 1, padding: 14 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    icon: { fontSize: 26 },
    title: { fontSize: 15, fontWeight: '800', color: '#1a1a1a' },
    time: { fontSize: 11, color: '#9ca3af', fontWeight: '600', marginTop: 1 },
    calBadge: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, alignItems: 'center' },
    calVal: { fontSize: 16, fontWeight: '900' },
    calUnit: { fontSize: 9, fontWeight: '700' },
    itemsWrap: { gap: 5, marginBottom: 10 },
    itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
    dot: { width: 5, height: 5, borderRadius: 3, marginTop: 5 },
    itemText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 18, fontWeight: '500' },
    macroRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f3f0ed' },
    macroKey: { fontSize: 11, fontWeight: '700' },
    macroVal: { fontWeight: '900' },
    sep: { color: '#d1d5db', fontSize: 14 },
});