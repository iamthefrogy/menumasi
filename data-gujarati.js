// Menu Masi dish database — Gujarati (loaded first, defines helper)
// D(cuisine, name, slots, weight, mins, [kcal,protein,carbs,fat,fiber] per person,
//   "tag,tag", [[name, qty, unit, cat], ...] for 3 people, "steps")
// slots: "B" breakfast, "D" dinner, "BD" both
// weight: 1 light, 2 medium, 3 heavy
// cat: veg | fruit | dairy | staple | bakery | packaged
// Tags: quick jain faraal protein fried sweet kid weekend guest festival
//       winter summer monsoon tiffin travel leftover treat
// Note: salt, oil, ghee, haldi, mirchi, dhana-jeeru, rai, jeera, hing, sugar for chai
//       are assumed pantry basics and not listed per dish.

var DISHES = [];
function D(cui, name, slots, wt, mins, nut, tags, ing, steps) {
  DISHES.push({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    cui: cui, name: name, slots: slots, wt: wt, mins: mins, nut: nut,
    tags: tags ? tags.split(",") : [], ing: ing, steps: steps
  });
}

// ---------- Breakfast / farsan ----------
D("gu","Methi Thepla + Curd","BD",1,30,[380,10,54,13,5],"quick,jain,tiffin,travel",
  [["Wheat flour (atta)",250,"g","staple"],["Methi leaves (fresh)",1,"bunch","veg"],["Curd",300,"g","dairy"],["Besan",50,"g","staple"],["Green chilli",3,"pcs","veg"],["Ginger",15,"g","veg"]],
  "Knead atta with chopped methi, besan, curd, spices. Roll thin theplas, roast with oil. Serve with curd or chundo.");
D("gu","Dudhi Thepla","BD",1,30,[360,9,52,12,4],"quick,jain,tiffin,travel",
  [["Wheat flour (atta)",250,"g","staple"],["Dudhi (bottle gourd)",300,"g","veg"],["Curd",150,"g","dairy"],["Green chilli",3,"pcs","veg"],["Ginger",15,"g","veg"]],
  "Grate dudhi into atta with spices and curd, knead stiff. Roll and roast theplas with oil.");
D("gu","Khakhra + Chai","B",1,15,[280,7,42,9,4],"quick,jain,travel",
  [["Khakhra",9,"pcs","packaged"],["Milk",400,"ml","dairy"],["Tea leaves",3,"tsp","staple"]],
  "Warm khakhra, serve with ghee or chundo and masala chai.");
D("gu","Khaman","B",1,35,[290,9,40,10,3],"jain,kid",
  [["Besan",250,"g","staple"],["Curd",100,"g","dairy"],["Eno fruit salt",1,"pack","packaged"],["Green chilli",3,"pcs","veg"],["Coriander leaves",0.5,"bunch","veg"],["Sev",50,"g","packaged"],["Lemon",1,"pcs","veg"]],
  "Make besan batter with curd, add eno, steam 20 min. Temper rai, sesame, sweet water. Top with coriander and sev.");
D("gu","Idada (White Dhokla)","B",1,30,[260,8,44,5,2],"jain",
  [["Idli-dhokla batter (rice + urad)",500,"g","staple"],["Green chilli",2,"pcs","veg"],["Ginger",10,"g","veg"]],
  "Steam fermented rice-urad batter with ginger-chilli paste. Cut, temper with rai and sesame.");
D("gu","Rava Dhokla","B",1,25,[270,7,40,8,2],"quick,jain",
  [["Rava (sooji)",250,"g","staple"],["Curd",200,"g","dairy"],["Eno fruit salt",1,"pack","packaged"],["Green chilli",3,"pcs","veg"]],
  "Instant rava-curd batter with eno, steam 15 min, temper rai and curry leaves.");
D("gu","Khandvi","B",1,35,[240,8,28,10,2],"jain",
  [["Besan",150,"g","staple"],["Curd",250,"g","dairy"],["Coconut (grated)",50,"g","staple"],["Coriander leaves",0.5,"bunch","veg"],["Curry leaves",1,"bunch","veg"]],
  "Cook besan-curd paste till thick, spread thin, roll. Temper rai, sesame, curry leaves; top coconut-coriander.");
D("gu","Handvo","BD",2,45,[400,12,50,16,6],"protein",
  [["Handvo flour (mixed dal-rice)",400,"g","staple"],["Dudhi (bottle gourd)",300,"g","veg"],["Curd",200,"g","dairy"],["Green chilli",3,"pcs","veg"],["Sesame seeds",2,"tbsp","staple"]],
  "Ferment handvo batter with grated dudhi and spices. Bake or pan-cook with sesame tempering till crusty.");
D("gu","Dudhi Muthiya (steamed)","B",1,35,[300,9,42,10,5],"jain,tiffin",
  [["Wheat flour (atta)",150,"g","staple"],["Besan",100,"g","staple"],["Dudhi (bottle gourd)",400,"g","veg"],["Curd",100,"g","dairy"],["Sesame seeds",2,"tbsp","staple"]],
  "Knead grated dudhi with atta-besan and spices, steam rolls, slice, temper with rai and sesame.");
D("gu","Methi Muthiya (fried)","B",2,40,[380,9,44,18,5],"fried,monsoon",
  [["Wheat flour (atta)",150,"g","staple"],["Besan",100,"g","staple"],["Methi leaves (fresh)",1,"bunch","veg"],["Curd",100,"g","dairy"]],
  "Knead methi with atta-besan dough, shape small muthiya, deep fry till golden.");
D("gu","Khichu","B",1,20,[280,5,50,6,2],"quick,jain",
  [["Rice flour",250,"g","staple"],["Green chilli",3,"pcs","veg"],["Sesame seeds",1,"tbsp","staple"]],
  "Cook rice flour into hot water with jeera, chilli, soda. Steam-serve with oil and pickle masala.");
D("gu","Methi na Gota","B",2,30,[400,11,42,20,5],"fried,monsoon,weekend",
  [["Besan",300,"g","staple"],["Methi leaves (fresh)",1,"bunch","veg"],["Curd",100,"g","dairy"],["Green chilli",4,"pcs","veg"],["Coriander seeds (crushed)",1,"tbsp","staple"]],
  "Loose besan-methi batter with crushed coriander and pepper, deep fry fluffy gota. Serve with kadhi or chutney.");
D("gu","Dalvada","B",2,35,[390,13,40,19,6],"fried,monsoon,protein,weekend",
  [["Moong dal (split, with skin)",300,"g","staple"],["Green chilli",4,"pcs","veg"],["Ginger",20,"g","veg"],["Onion",2,"pcs","veg"]],
  "Soak and coarse-grind moong dal, mix chilli-ginger, deep fry vada. Serve with fried chilli and onion.");
D("gu","Batata Vada","BD",2,35,[420,8,52,20,4],"fried,kid",
  [["Potato",600,"g","veg"],["Besan",200,"g","staple"],["Green chilli",4,"pcs","veg"],["Ginger",20,"g","veg"],["Lemon",1,"pcs","veg"],["Coriander leaves",0.5,"bunch","veg"]],
  "Spiced mashed potato balls dipped in besan batter, deep fried. Serve with green and meethi chutney.");
D("gu","Gujarati Bhajiya (mix)","B",2,30,[400,9,44,21,4],"fried,monsoon",
  [["Besan",250,"g","staple"],["Potato",2,"pcs","veg"],["Onion",2,"pcs","veg"],["Methi leaves (fresh)",0.5,"bunch","veg"],["Green chilli",4,"pcs","veg"]],
  "Slice potato-onion, dip in spiced besan batter with methi, deep fry assorted bhajiya.");
D("gu","Fafda + Jalebi","B",3,50,[550,10,70,26,3],"fried,weekend,festival,sweet,treat",
  [["Besan",300,"g","staple"],["Maida",150,"g","staple"],["Papaya (raw, for sambharo)",200,"g","veg"],["Curd",50,"g","dairy"],["Besan (for kadhi)",50,"g","staple"]],
  "Roll and fry fafda strips, make jalebi from fermented maida batter in sugar syrup. Serve with papaya sambharo and kadhi.");
D("gu","Sev Khamani","B",1,30,[330,12,36,15,4],"weekend",
  [["Chana dal",300,"g","staple"],["Sev",100,"g","packaged"],["Pomegranate",1,"pcs","fruit"],["Coconut (grated)",50,"g","staple"],["Coriander leaves",0.5,"bunch","veg"],["Lemon",1,"pcs","veg"]],
  "Steam and crumble chana dal, temper with garlic-chilli, finish with lemon-sugar. Top sev, dadam, coconut.");
D("gu","Surti Locho","B",1,40,[320,13,36,13,3],"weekend",
  [["Chana dal",250,"g","staple"],["Urad dal (split)",50,"g","staple"],["Butter",50,"g","dairy"],["Sev",80,"g","packaged"],["Onion",2,"pcs","veg"],["Coriander leaves",0.5,"bunch","veg"]],
  "Steam loose chana-urad batter till soft-set. Serve hot with butter, sev, onion, chutneys.");
D("gu","Patra","B",2,45,[310,8,38,14,5],"jain",
  [["Patra (colocasia) leaves",10,"pcs","veg"],["Besan",250,"g","staple"],["Tamarind",30,"g","staple"],["Jaggery",50,"g","staple"],["Sesame seeds",2,"tbsp","staple"]],
  "Spread sweet-tangy besan paste on patra leaves, roll, steam, slice, temper with rai and sesame.");
D("gu","Chorafali","B",1,35,[330,10,36,16,2],"fried,festival",
  [["Besan",250,"g","staple"],["Urad dal flour",100,"g","staple"],["Black salt",1,"tsp","staple"],["Red chilli powder",1,"tbsp","staple"]],
  "Knead stiff besan-urad dough, roll paper thin, fry strips, dust with black salt and mirchi.");
D("gu","Dhebra","B",1,35,[350,9,48,13,5],"tiffin,travel,winter",
  [["Bajra flour",250,"g","staple"],["Methi leaves (fresh)",1,"bunch","veg"],["Curd",150,"g","dairy"],["Jaggery",30,"g","staple"]],
  "Knead bajra flour with methi, curd, jaggery, spices. Pat small dhebra, shallow fry both sides.");
D("gu","Sukhdi","B",1,20,[380,6,48,18,2],"sweet,jain,quick,treat",
  [["Wheat flour (atta)",250,"g","staple"],["Jaggery",200,"g","staple"],["Ghee",150,"g","dairy"]],
  "Roast atta in ghee till nutty, melt in jaggery off flame, set and cut squares.");
D("gu","Sooji no Sheero","B",1,20,[400,6,52,19,2],"sweet,jain,quick,treat,festival",
  [["Rava (sooji)",200,"g","staple"],["Ghee",100,"g","dairy"],["Milk",300,"ml","dairy"],["Cashews",30,"g","staple"],["Raisins",30,"g","staple"]],
  "Roast rava in ghee, add hot milk-water and sugar, cook thick, finish with nuts and elaichi.");
D("gu","Fada Lapsi","B",1,30,[390,8,56,15,4],"sweet,jain,treat,festival",
  [["Dalia (fada)",250,"g","staple"],["Ghee",100,"g","dairy"],["Jaggery",150,"g","staple"],["Cashews",30,"g","staple"]],
  "Roast broken wheat in ghee, pressure cook, sweeten with jaggery, garnish nuts.");

// ---------- Shaak dinners (with rotli) ----------
D("gu","Sev Tameta nu Shaak + Rotli","D",1,25,[420,10,56,17,5],"quick,jain,kid",
  [["Tomato",600,"g","veg"],["Sev",100,"g","packaged"],["Wheat flour (atta)",200,"g","staple"],["Coriander leaves",0.5,"bunch","veg"],["Jaggery",20,"g","staple"]],
  "Tangy-sweet tomato gravy with jeera tempering, add sev at serving. Fresh rotli alongside.");
D("gu","Bhinda nu Shaak + Rotli","D",2,30,[400,10,50,17,7],"jain",
  [["Bhinda (okra)",500,"g","veg"],["Wheat flour (atta)",200,"g","staple"],["Besan",30,"g","staple"]],
  "Dry-fry chopped bhinda with dhana-jeeru and besan dusting till crisp-soft. Serve with rotli.");
D("gu","Bharela Bhinda + Rotli","D",2,40,[440,11,50,21,7],"",
  [["Bhinda (okra)",500,"g","veg"],["Besan",100,"g","staple"],["Peanuts (crushed)",50,"g","staple"],["Wheat flour (atta)",200,"g","staple"],["Coconut (grated)",30,"g","staple"]],
  "Stuff slit bhinda with besan-peanut masala, slow cook covered. Serve with rotli.");
D("gu","Ringan no Olo + Rotlo","D",2,40,[420,11,52,17,8],"winter",
  [["Baingan (large bharta)",2,"pcs","veg"],["Bajra flour",250,"g","staple"],["Onion",2,"pcs","veg"],["Tomato",2,"pcs","veg"],["Green garlic",1,"bunch","veg"],["Jaggery",20,"g","staple"]],
  "Roast baingan on flame, mash with green garlic, onion, oil tempering. Serve with bajra rotlo and jaggery.");
D("gu","Ravaiya (stuffed ringan-batata) + Rotli","D",3,45,[520,12,60,25,8],"weekend",
  [["Baby brinjal",400,"g","veg"],["Potato",300,"g","veg"],["Peanuts (crushed)",80,"g","staple"],["Besan",80,"g","staple"],["Coconut (grated)",40,"g","staple"],["Wheat flour (atta)",200,"g","staple"]],
  "Stuff slit baby brinjal and potato with peanut-besan-coconut masala, slow cook in kadhai. Rotli alongside.");
D("gu","Dudhi nu Shaak + Rotli","D",1,30,[380,9,52,14,5],"jain",
  [["Dudhi (bottle gourd)",600,"g","veg"],["Tomato",2,"pcs","veg"],["Wheat flour (atta)",200,"g","staple"]],
  "Pressure cook dudhi with tomato and mild masala, temper jeera. Light dinner with rotli.");
D("gu","Dudhi Chana Dal nu Shaak + Rotli","D",2,35,[430,14,58,14,7],"jain,protein",
  [["Dudhi (bottle gourd)",500,"g","veg"],["Chana dal",150,"g","staple"],["Tomato",2,"pcs","veg"],["Wheat flour (atta)",200,"g","staple"]],
  "Cook soaked chana dal with dudhi cubes in light gravy. Serve with rotli.");
D("gu","Rasawala Batata nu Shaak + Rotli","D",1,25,[420,9,60,15,5],"quick,jain,kid",
  [["Potato",600,"g","veg"],["Tomato",3,"pcs","veg"],["Wheat flour (atta)",200,"g","staple"],["Coriander leaves",0.5,"bunch","veg"]],
  "Boiled potato in thin spicy tomato ras with methi-rai tempering. Great with rotli or puri.");
D("gu","Sukhi Bhaji + Puri","D",2,35,[480,9,58,23,4],"jain,weekend,kid",
  [["Potato",600,"g","veg"],["Wheat flour (atta)",250,"g","staple"],["Green chilli",3,"pcs","veg"],["Curry leaves",1,"bunch","veg"],["Lemon",1,"pcs","veg"]],
  "Dry potato bhaji with rai-curry leaf tempering, fresh puffed puris.");
D("gu","Kobi Vatana nu Shaak + Rotli","D",1,30,[390,10,52,15,6],"quick",
  [["Cabbage",500,"g","veg"],["Green peas",150,"g","veg"],["Wheat flour (atta)",200,"g","staple"],["Ginger",15,"g","veg"]],
  "Stir-cook shredded cabbage with peas, hing-rai tempering, soft finish. Rotli alongside.");
D("gu","Flower Vatana nu Shaak + Rotli","D",2,35,[400,11,52,16,6],"",
  [["Cauliflower",1,"pcs","veg"],["Green peas",150,"g","veg"],["Tomato",2,"pcs","veg"],["Wheat flour (atta)",200,"g","staple"]],
  "Cauliflower-peas in light masala, covered cook till just soft. Serve with rotli.");
D("gu","Gavar nu Shaak + Rotli","D",2,35,[380,11,50,14,8],"jain",
  [["Gavar (cluster beans)",400,"g","veg"],["Ajwain",1,"tsp","staple"],["Wheat flour (atta)",200,"g","staple"],["Jaggery",15,"g","staple"]],
  "Pressure cook gavar, temper ajwain-hing, touch of jaggery. Fibre-rich, with rotli.");
D("gu","Tindora nu Shaak + Rotli","D",2,35,[380,9,52,14,6],"jain",
  [["Tindora",400,"g","veg"],["Wheat flour (atta)",200,"g","staple"],["Coconut (grated)",30,"g","staple"]],
  "Slit tindora slow cooked with dhana-jeeru till edges crisp. Rotli alongside.");
D("gu","Karela nu Shaak + Rotli","D",1,35,[360,9,48,14,6],"jain",
  [["Karela",400,"g","veg"],["Jaggery",30,"g","staple"],["Wheat flour (atta)",200,"g","staple"]],
  "Salted-squeezed karela slices fried, tossed with jaggery-masala balance. Serve with rotli.");
D("gu","Bharela Karela + Rotli","D",2,45,[420,11,48,20,6],"weekend",
  [["Karela",400,"g","veg"],["Besan",100,"g","staple"],["Peanuts (crushed)",50,"g","staple"],["Jaggery",30,"g","staple"],["Wheat flour (atta)",200,"g","staple"]],
  "Stuff karela with sweet-spicy besan masala, tie and slow cook. Rotli alongside.");
D("gu","Rasawala Chora + Rotli","D",2,35,[430,15,58,13,9],"protein",
  [["Chora (black-eyed peas)",250,"g","staple"],["Tomato",2,"pcs","veg"],["Wheat flour (atta)",200,"g","staple"],["Coriander leaves",0.5,"bunch","veg"]],
  "Pressure cook chora in thin tomato ras, hing-jeera tempering. Protein-heavy, with rotli.");
D("gu","Vaal nu Shaak + Rotli","D",2,35,[420,15,54,13,9],"jain,protein",
  [["Vaal (field beans)",250,"g","staple"],["Ajwain",1,"tsp","staple"],["Jaggery",20,"g","staple"],["Wheat flour (atta)",200,"g","staple"]],
  "Soaked vaal cooked with ajwain-hing and jaggery, slightly thick gravy. Rotli alongside.");
D("gu","Tuver Lilva nu Shaak + Rotli","D",2,35,[430,14,56,14,8],"winter,protein",
  [["Tuver lilva (fresh)",300,"g","veg"],["Tomato",2,"pcs","veg"],["Wheat flour (atta)",200,"g","staple"],["Coconut (grated)",30,"g","staple"]],
  "Fresh tuver beans in mild coconut-tomato masala. Winter special, with rotli.");
D("gu","Undhiyu + Puri","D",3,90,[650,16,68,34,12],"winter,festival,guest,weekend",
  [["Surti papdi",300,"g","veg"],["Purple yam (ratalu)",200,"g","veg"],["Sweet potato",200,"g","veg"],["Baby brinjal",200,"g","veg"],["Potato",200,"g","veg"],["Tuver lilva (fresh)",150,"g","veg"],["Methi leaves (fresh)",1,"bunch","veg"],["Besan",150,"g","staple"],["Coconut (grated)",80,"g","staple"],["Green garlic",1,"bunch","veg"],["Wheat flour (atta)",250,"g","staple"]],
  "Layer winter veg, methi muthiya and green masala, slow cook undhiyu. Serve with puri.");
D("gu","Panchkutiyu Shaak + Rotli","D",2,45,[450,13,56,19,9],"winter",
  [["Surti papdi",200,"g","veg"],["Potato",200,"g","veg"],["Baby brinjal",200,"g","veg"],["Green peas",100,"g","veg"],["Methi leaves (fresh)",0.5,"bunch","veg"],["Besan",80,"g","staple"],["Wheat flour (atta)",200,"g","staple"]],
  "Five-veg masala shaak with methi gota bits, undhiyu's quick cousin. Rotli alongside.");
D("gu","Methi Batata nu Shaak + Rotli","D",2,30,[400,10,52,16,6],"winter,jain",
  [["Methi leaves (fresh)",2,"bunch","veg"],["Potato",400,"g","veg"],["Wheat flour (atta)",200,"g","staple"],["Jaggery",15,"g","staple"]],
  "Methi wilted with potato cubes, sweet-bitter balance. Serve with rotli.");
D("gu","Kela nu Shaak + Rotli","D",1,20,[390,8,56,14,5],"quick,jain",
  [["Raw banana",4,"pcs","veg"],["Wheat flour (atta)",200,"g","staple"],["Coconut (grated)",30,"g","staple"],["Lemon",1,"pcs","veg"]],
  "Raw banana cubes in ajwain-hing tempering, quick dry shaak. Rotli alongside.");
D("gu","Sukhi Mag ni Dal + Rotli","D",1,25,[410,16,56,12,8],"quick,jain,protein",
  [["Moong dal (split, with skin)",250,"g","staple"],["Wheat flour (atta)",200,"g","staple"],["Lemon",1,"pcs","veg"],["Coriander leaves",0.5,"bunch","veg"]],
  "Dry-cooked mag ni dal with hing-jeera, lemon finish. Simple protein dinner with rotli.");
D("gu","Mag nu Shaak + Rotli","D",1,30,[420,16,58,12,9],"jain,protein",
  [["Whole moong",250,"g","staple"],["Tomato",2,"pcs","veg"],["Wheat flour (atta)",200,"g","staple"]],
  "Whole moong in light gravy, desi tempering. With rotli or bhakri.");
D("gu","Kala Chana nu Shaak + Rotli","D",2,35,[440,16,60,13,10],"protein",
  [["Kala chana",250,"g","staple"],["Tomato",2,"pcs","veg"],["Onion",1,"pcs","veg"],["Wheat flour (atta)",200,"g","staple"]],
  "Soaked kala chana in semi-dry masala. Iron and protein rich, with rotli.");

// ---------- Dal / one-pot / combos ----------
D("gu","Gujarati Dal-Bhat + Seasonal Shaak","D",2,45,[560,17,86,15,8],"protein,jain",
  [["Toor dal",200,"g","staple"],["Rice",250,"g","staple"],["Seasonal vegetable",400,"g","veg"],["Tomato",2,"pcs","veg"],["Jaggery",25,"g","staple"],["Kokum",4,"pcs","staple"],["Peanuts",30,"g","staple"],["Wheat flour (atta)",150,"g","staple"]],
  "Khatti-mithi toor dal with kokum-jaggery, steamed rice, one seasonal shaak, rotli.");
D("gu","Gujarati Kadhi-Khichdi","D",1,30,[450,14,70,12,5],"quick,jain,kid",
  [["Rice",200,"g","staple"],["Moong dal (split, with skin)",100,"g","staple"],["Curd",300,"g","dairy"],["Besan",40,"g","staple"],["Curry leaves",1,"bunch","veg"],["Ginger",15,"g","veg"]],
  "Soft mag ni dal khichdi with sweet curd kadhi, ghee on top. Ultimate comfort dinner.");
D("gu","Vaghareli Khichdi","D",2,30,[480,13,74,14,6],"quick,leftover",
  [["Rice",200,"g","staple"],["Toor dal",100,"g","staple"],["Potato",1,"pcs","veg"],["Onion",1,"pcs","veg"],["Tomato",2,"pcs","veg"],["Green peas",100,"g","veg"],["Curd",200,"g","dairy"]],
  "Masala khichdi tempered with whole spices and veg, serve with dahi or chaas.");
D("gu","Ram Khichdi","D",2,35,[500,14,76,15,7],"",
  [["Rice",200,"g","staple"],["Toor dal",100,"g","staple"],["Mixed vegetables",400,"g","veg"],["Peanuts",40,"g","staple"],["Curd",200,"g","dairy"]],
  "Loaded veg khichdi with peanuts and whole garam masala. Kadhi or chaas alongside.");
D("gu","Dal Dhokli","D",2,45,[520,16,80,14,8],"protein,jain",
  [["Toor dal",200,"g","staple"],["Wheat flour (atta)",200,"g","staple"],["Peanuts",40,"g","staple"],["Jaggery",25,"g","staple"],["Kokum",4,"pcs","staple"],["Lemon",1,"pcs","veg"]],
  "Masala atta dhokli simmered in khatti-mithi dal with peanuts. One-pot Sunday classic.");
D("gu","Fada ni Khichdi","D",2,35,[440,14,66,12,9],"protein",
  [["Dalia (fada)",200,"g","staple"],["Moong dal (split, with skin)",100,"g","staple"],["Mixed vegetables",300,"g","veg"],["Curd",200,"g","dairy"]],
  "Broken wheat and moong dal pressure cooked with veg. High fibre, serve with dahi.");
D("gu","Puri + Shrikhand + Batata Shaak","D",3,40,[680,14,86,30,4],"sweet,festival,guest,weekend,treat",
  [["Wheat flour (atta)",250,"g","staple"],["Shrikhand",500,"g","dairy"],["Potato",400,"g","veg"],["Tomato",2,"pcs","veg"]],
  "Festival plate: hot puris, kesar-elaichi shrikhand, rasawala batata shaak.");
D("gu","Vedmi (Puran Poli) + Dal-Bhat","D",3,60,[650,18,98,20,8],"sweet,festival,guest,treat",
  [["Wheat flour (atta)",250,"g","staple"],["Toor dal",250,"g","staple"],["Jaggery",200,"g","staple"],["Rice",200,"g","staple"],["Ghee",80,"g","dairy"]],
  "Sweet tuver-jaggery stuffed vedmi with ghee, plus dal-bhat. Festival lunch-style dinner.");
D("gu","Basundi + Puri","D",3,50,[620,15,72,30,2],"sweet,festival,guest,treat",
  [["Milk",1.5,"l","dairy"],["Wheat flour (atta)",250,"g","staple"],["Cashews",30,"g","staple"],["Pistachios",20,"g","staple"]],
  "Slow-reduced sweetened milk with nutmeg-elaichi and nuts, served chilled with puri.");
D("gu","Gujarati Thali (dal, bhat, rotli, 2 shaak, farsan)","D",3,75,[720,20,100,26,10],"guest,festival,weekend",
  [["Toor dal",200,"g","staple"],["Rice",250,"g","staple"],["Wheat flour (atta)",250,"g","staple"],["Seasonal vegetable",400,"g","veg"],["Potato",300,"g","veg"],["Besan",150,"g","staple"],["Curd",300,"g","dairy"],["Jaggery",30,"g","staple"],["Papad",6,"pcs","packaged"]],
  "Full thali: dal, bhat, rotli, two shaak, one farsan (khaman/gota), papad, chaas. For guests.");

// ---------- More Gujarati ----------
D("gu","Besan na Puda","B",1,20,[320,11,38,13,4],"quick,protein",
  [["Besan",250,"g","staple"],["Onion",1,"pcs","veg"],["Tomato",2,"pcs","veg"],["Green chilli",3,"pcs","veg"],["Coriander leaves",0.5,"bunch","veg"]],
  "Spiced besan batter pancakes on tawa, crisp edges. Serve with chutney or athanu.");
D("gu","Bhakhri + Batata Shaak + Chai","B",1,25,[380,9,52,14,4],"quick,jain,travel",
  [["Wheat flour (atta)",250,"g","staple"],["Potato",300,"g","veg"],["Milk",400,"ml","dairy"],["Tea leaves",2,"tsp","staple"]],
  "Crisp ghee bhakhri with quick sukhi batata shaak and masala chai.");
D("gu","Vaghareli Rotli","B",1,15,[300,8,44,11,3],"quick,leftover,jain",
  [["Leftover rotli",8,"pcs","staple"],["Curd",200,"g","dairy"],["Green chilli",3,"pcs","veg"],["Curry leaves",1,"bunch","veg"]],
  "Last night's rotli torn and tossed in rai-hing vaghar with curd. Zero waste breakfast.");
D("gu","Sev Mamra + Chai","B",1,10,[290,6,44,10,2],"quick,jain",
  [["Mamra (puffed rice)",150,"g","packaged"],["Sev",100,"g","packaged"],["Onion",1,"pcs","veg"],["Tomato",2,"pcs","veg"],["Milk",400,"ml","dairy"],["Tea leaves",2,"tsp","staple"]],
  "Quick sev-mamra nasto with chopped onion-tomato, masala chai alongside.");
D("gu","Thepla + Sambharo + Chaas","D",1,20,[380,9,50,14,5],"quick,leftover,jain",
  [["Wheat flour (atta)",200,"g","staple"],["Cabbage",300,"g","veg"],["Carrot",2,"pcs","veg"],["Curd",300,"g","dairy"],["Green chilli",3,"pcs","veg"]],
  "Fresh or leftover thepla with warm cabbage-carrot sambharo and jeera chaas.");
D("gu","Bajra Rotlo + Doodh + Gud","D",1,25,[420,12,60,13,6],"winter,jain,quick",
  [["Bajra flour",300,"g","staple"],["Milk",600,"ml","dairy"],["Jaggery",40,"g","staple"]],
  "Hot rotlo crumbled into warm milk with jaggery. Old-school light winter dinner.");
D("gu","Turiya nu Shaak + Rotli","D",1,30,[370,9,50,14,6],"jain",
  [["Turiya (ridge gourd)",500,"g","veg"],["Tomato",2,"pcs","veg"],["Wheat flour (atta)",200,"g","staple"]],
  "Ridge gourd cooked soft in jeera-tomato masala. Light dinner with rotli.");
D("gu","Chora Fali nu Shaak + Rotli","D",2,30,[390,11,52,14,7],"jain",
  [["Chora fali (chawli beans)",400,"g","veg"],["Tomato",2,"pcs","veg"],["Wheat flour (atta)",200,"g","staple"]],
  "Long beans chopped and cooked with ajwain-hing masala. Rotli alongside.");
D("gu","Valor Papdi nu Shaak + Rotli","D",2,35,[400,12,52,15,8],"winter,jain",
  [["Valor papdi",400,"g","veg"],["Ajwain",1,"tsp","staple"],["Coconut (grated)",30,"g","staple"],["Wheat flour (atta)",200,"g","staple"]],
  "Winter valor papdi slow cooked with ajwain and coconut. Serve with rotli.");
