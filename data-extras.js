// Menu Masi dish database — Drinks + Desserts
// These categories are browse/add-on items: never auto-planned by the weekly
// generator, but can be added to any meal manually via swap/picker.

// ---------- Drinks (per glass, 3 glasses) ----------
D("dr","Masala Chai","BD",1,10,[60,2,8,2,0],"quick,jain",
  [["Milk",400,"ml","dairy"],["Tea leaves",3,"tsp","staple"],["Ginger",10,"g","veg"]],
  "Boil tea with milk, adrak and masala. Strain into cups.");
D("dr","Masala Chaas","BD",1,5,[45,3,5,1,0],"quick,jain,summer",
  [["Curd",300,"g","dairy"],["Coriander leaves",0.25,"bunch","veg"],["Curry leaves",0.5,"bunch","veg"],["Ginger",10,"g","veg"]],
  "Whisk curd with water, jeera powder, ginger, tempering optional. Serve chilled.");
D("dr","Mango Lassi","BD",1,10,[180,5,30,4,1],"quick,jain,summer,kid",
  [["Curd",400,"g","dairy"],["Mango pulp",300,"g","fruit"],["Sugar",30,"g","staple"]],
  "Blend thick curd with mango pulp and sugar till creamy.");
D("dr","Sweet Lassi","BD",1,5,[160,5,24,5,0],"quick,jain,summer",
  [["Curd",500,"g","dairy"],["Sugar",40,"g","staple"],["Cardamom",2,"pcs","staple"]],
  "Churn curd with sugar and elaichi, top with malai.");
D("dr","Fresh Lime Soda","BD",1,5,[50,0,12,0,0],"quick,jain,summer",
  [["Lemon",3,"pcs","veg"],["Soda water",600,"ml","packaged"],["Sugar",30,"g","staple"]],
  "Lemon juice, sugar or salt, top with chilled soda.");
D("dr","Jaljeera","BD",1,5,[40,1,9,0,0],"quick,jain,summer",
  [["Jaljeera powder",3,"tsp","packaged"],["Lemon",2,"pcs","veg"],["Mint leaves",0.5,"bunch","veg"]],
  "Stir jaljeera powder in cold water with lemon and mint, boondi on top.");
D("dr","Aam Panna","BD",1,20,[90,1,22,0,1],"jain,summer",
  [["Raw mango (seasonal)",2,"pcs","veg"],["Sugar",60,"g","staple"],["Mint leaves",0.5,"bunch","veg"]],
  "Boil raw mango, blend pulp with sugar, jeera, kala namak. Dilute and chill.");
D("dr","Watermelon Juice","BD",1,10,[70,1,17,0,1],"quick,jain,summer",
  [["Watermelon",1,"kg","fruit"],["Lemon",1,"pcs","veg"],["Mint leaves",0.25,"bunch","veg"]],
  "Blend chilled watermelon, strain light, lemon-mint finish.");
D("dr","Orange Juice","BD",1,10,[90,1,20,0,1],"quick,jain",
  [["Orange",6,"pcs","fruit"]],
  "Fresh squeezed oranges, no sugar needed.");
D("dr","Mixed Fruit Juice","BD",1,10,[100,1,24,0,1],"quick,jain",
  [["Seasonal fruits",600,"g","fruit"],["Lemon",1,"pcs","veg"]],
  "Blend seasonal fruits with little water and lemon.");
D("dr","Virgin Mojito","BD",1,10,[80,0,20,0,0],"quick,jain,guest,summer",
  [["Mint leaves",1,"bunch","veg"],["Lemon",3,"pcs","veg"],["Soda water",600,"ml","packaged"],["Sugar",40,"g","staple"]],
  "Muddle mint-lime-sugar, top with soda and ice.");
D("dr","Blue Lagoon Mocktail","BD",1,10,[110,0,27,0,0],"quick,guest,kid",
  [["Blue curacao syrup",90,"ml","packaged"],["Soda water",600,"ml","packaged"],["Lemon",2,"pcs","veg"]],
  "Blue syrup over ice, lemon squeeze, top with soda.");
D("dr","Rose Falooda","BD",1,20,[220,6,36,6,1],"treat,weekend,kid,summer",
  [["Milk",600,"ml","dairy"],["Rose syrup",90,"ml","packaged"],["Falooda sev + sabja",1,"pack","packaged"],["Ice cream",3,"pcs","packaged"]],
  "Layer rose milk, soaked sabja, falooda sev, scoop of ice cream.");
D("dr","Cold Coffee","BD",1,10,[150,5,22,5,0],"quick,kid",
  [["Milk",600,"ml","dairy"],["Instant coffee",3,"tsp","packaged"],["Sugar",40,"g","staple"]],
  "Blend chilled milk, coffee, sugar and ice till frothy.");
D("dr","Banana Milkshake","BD",1,5,[180,6,32,4,1],"quick,jain,kid",
  [["Milk",600,"ml","dairy"],["Banana",3,"pcs","fruit"],["Honey",2,"tbsp","staple"]],
  "Blend banana with cold milk and honey.");
D("dr","Chocolate Milkshake","BD",1,5,[220,6,34,7,1],"quick,kid,treat",
  [["Milk",600,"ml","dairy"],["Chocolate syrup",60,"ml","packaged"],["Ice cream",2,"pcs","packaged"]],
  "Blend milk, chocolate syrup, scoop of ice cream.");
D("dr","Badam Milk","BD",1,15,[190,7,20,10,1],"jain,winter,guest",
  [["Milk",600,"ml","dairy"],["Almonds",50,"g","staple"],["Saffron",1,"pinch","staple"],["Sugar",30,"g","staple"]],
  "Simmer milk with almond paste, kesar, elaichi. Hot or chilled.");
D("dr","Thandai","BD",1,20,[200,6,24,10,1],"jain,festival,guest",
  [["Milk",600,"ml","dairy"],["Thandai masala/paste",3,"tbsp","packaged"],["Sugar",30,"g","staple"]],
  "Chilled milk churned with thandai paste of nuts and spices.");
D("dr","Kokum Sharbat","BD",1,10,[60,0,15,0,0],"quick,jain,summer",
  [["Kokum",50,"g","staple"],["Sugar",60,"g","staple"],["Lemon",1,"pcs","veg"]],
  "Soak kokum, blend with sugar and jeera, dilute with cold water.");

// ---------- Desserts (per serving, for 3) ----------
D("ds","Gulab Jamun","D",1,45,[320,5,44,14,0],"sweet,treat,festival,guest",
  [["Gulab jamun mix",1,"pack","packaged"],["Sugar",300,"g","staple"],["Cardamom",4,"pcs","staple"]],
  "Fry soft khoya balls, soak in warm elaichi-kesar syrup.");
D("ds","Rice Kheer","BD",1,40,[260,7,38,9,0],"sweet,jain,treat,festival",
  [["Rice",100,"g","staple"],["Milk",1,"l","dairy"],["Sugar",100,"g","staple"],["Cashews",30,"g","staple"],["Raisins",20,"g","staple"]],
  "Slow-simmer rice in milk till creamy, sweeten, nuts and elaichi.");
D("ds","Sevai Kheer","BD",1,25,[240,6,36,8,0],"sweet,jain,treat,quick",
  [["Vermicelli (semiya)",100,"g","staple"],["Milk",1,"l","dairy"],["Sugar",80,"g","staple"],["Cashews",20,"g","staple"]],
  "Roast semiya in ghee, simmer in milk, sweeten and garnish.");
D("ds","Gajar no Halwo","D",1,60,[300,6,36,15,3],"sweet,jain,treat,winter,festival,guest",
  [["Carrot",800,"g","veg"],["Milk",500,"ml","dairy"],["Ghee",80,"g","dairy"],["Sugar",120,"g","staple"],["Cashews",30,"g","staple"]],
  "Grated gajar slow-cooked in milk and ghee till glossy, nuts on top.");
D("ds","Dudhi no Halwo","D",1,50,[280,5,34,14,2],"sweet,jain,treat,winter",
  [["Dudhi (bottle gourd)",700,"g","veg"],["Milk",500,"ml","dairy"],["Ghee",70,"g","dairy"],["Sugar",100,"g","staple"]],
  "Grated dudhi cooked down in milk-ghee, elaichi finish.");
D("ds","Moong Dal Sheero","D",1,50,[340,8,40,16,2],"sweet,jain,treat,festival,guest",
  [["Moong dal (yellow)",200,"g","staple"],["Ghee",120,"g","dairy"],["Milk",300,"ml","dairy"],["Sugar",120,"g","staple"]],
  "Soaked ground moong dal roasted patiently in ghee, rich festival sheero.");
D("ds","Fruit Custard","BD",1,25,[220,5,36,6,2],"sweet,jain,treat,summer,kid",
  [["Milk",750,"ml","dairy"],["Custard powder",3,"tbsp","packaged"],["Seasonal fruits",400,"g","fruit"],["Sugar",60,"g","staple"]],
  "Thick vanilla custard chilled with chopped fruits.");
D("ds","Kulfi","D",1,30,[240,6,26,12,0],"sweet,jain,treat,summer,kid",
  [["Milk",1,"l","dairy"],["Sugar",80,"g","staple"],["Cashews",30,"g","staple"],["Cardamom",4,"pcs","staple"]],
  "Reduce milk by half, sweeten, freeze in moulds overnight.");
D("ds","Ice Cream Sundae","BD",1,10,[280,5,36,13,0],"sweet,treat,quick,kid",
  [["Ice cream",1,"pack","packaged"],["Seasonal fruits",300,"g","fruit"],["Chocolate syrup",40,"ml","packaged"],["Mixed nuts",40,"g","staple"]],
  "Scoops layered with fruits, nuts and syrup.");
D("ds","Kesar Shrikhand","BD",1,20,[280,8,32,12,0],"sweet,jain,treat,festival",
  [["Curd",700,"g","dairy"],["Sugar",100,"g","staple"],["Saffron",1,"pinch","staple"],["Pistachios",20,"g","staple"]],
  "Hung curd whipped with sugar, kesar and elaichi.");
D("ds","Malpua","D",1,40,[380,6,48,18,1],"sweet,treat,festival,fried",
  [["Maida",200,"g","staple"],["Milk",400,"ml","dairy"],["Sugar",200,"g","staple"],["Fennel seeds",1,"tsp","staple"]],
  "Fry soft maida-milk pancakes, dip in syrup, rabdi optional.");
D("ds","Chocolate Brownie","D",1,45,[330,5,40,17,2],"sweet,treat,kid,weekend",
  [["Maida",150,"g","staple"],["Cocoa powder",50,"g","packaged"],["Butter",120,"g","dairy"],["Sugar",150,"g","staple"],["Milk",100,"ml","dairy"]],
  "Fudgy eggless brownie — bake, cool, cut squares.");
