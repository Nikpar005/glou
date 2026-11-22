import { dayKey, minutesOfDay, parseTime } from './dates.js'
import { expectedFraction } from './mood.js'
import { tipIndex } from './tips.js'

const LINES = {
  el: {
    morning: [
      "Ο Θαλής είπε ότι αρχή των πάντων είναι το νερό. Η αρχή της δικής σου μέρας πάντως ήταν ο καφές.",
      "Κοιμήθηκες ώρες χωρίς νερό. Αυτό μόνο οι καμήλες το κάνουν με περηφάνια.",
      "Είσαι περίπου 60% νερό. Το πρωί μάλλον λίγο λιγότερο.",
      "Ο ήλιος ανέτειλε, ο καφές ψήθηκε. Το νερό είναι ακόμα στη βρύση και περιμένει.",
      "Καλημέρα. Το μπουκάλι σε περιμένει από χθες βράδυ, με την υπομονή της Πηνελόπης.",
      "Ο εγκέφαλός σου είναι περίπου 75% νερό. Πριν τον βάλεις να δουλέψει, γέμισέ τον.",
      "Ο Αρχιμήδης φώναξε «Εύρηκα» μέσα στο νερό. Εσύ βρες πρώτα το ποτήρι.",
      "Σήμερα ο στόχος είναι {goal}. Ο Ηρακλής είχε δώδεκα άθλους, εσύ έχεις έναν.",
      "Η μέδουσα είναι 95% νερό και δεν έχει καν εγκέφαλο. Εσύ έχεις, οπότε πιες.",
      "Πρωί χωρίς νερό είναι σαν κινητό στο 5%. Δουλεύει, αλλά με άγχος.",
      "Καλημέρα. Μηδέν ml ως τώρα. Από τα λίγα σκορ που φτιάχνονται με ένα ποτήρι.",
      "Ο Φειδιππίδης έτρεξε από τον Μαραθώνα ως την Αθήνα. Εσύ απλώς σήκω από το κρεβάτι.",
    ],
    behind: [
      "Τον Τάνταλο τον τιμώρησαν με νερό που δεν μπορούσε να πιει. Εσύ μπορείς. Τι περιμένεις;",
      "Στον Άδη έπιναν από τη Λήθη για να ξεχάσουν. Εσύ ξέχασες χωρίς να πιεις τίποτα.",
      "Ο Μίδας δεν μπορούσε να πιει νερό γιατί γινόταν χρυσάφι. Εσένα τι σε εμποδίζει;",
      "Ο Διογένης πέταξε την κούπα του όταν είδε ένα παιδί να πίνει με τις χούφτες. Εσύ έχεις κούπα και δεν τη χρησιμοποιείς.",
      "«Τα πάντα ρει», είπε ο Ηράκλειτος. Εκτός από το νερό στο ποτήρι σου, που δεν έχει κουνηθεί από το πρωί.",
      "Δεν λέω ότι είσαι αφυδατωμένος. Λέω ότι μια καμήλα σε κοιτάει με ανησυχία.",
      "Ο στόχος σε περιμένει. Το μπουκάλι σε περιμένει. Εγώ σε περιμένω. Όλοι περιμένουμε.",
      "Σήμερα είσαι πιο στεγνός από τα αστεία του πατέρα σου.",
      "Ένα μεγάλο δέντρο πίνει εκατοντάδες λίτρα τη μέρα και δεν το συζητάει καν.",
      "Η δίψα εμφανίζεται όταν έχεις ήδη χάσει λίγο νερό. Δηλαδή, αν διψάς, άργησες.",
      "Ο Οδυσσέας έκανε δέκα χρόνια να γυρίσει σπίτι. Εσύ κάνεις δέκα λεπτά να πας στην κουζίνα.",
      "«Μολών λαβέ», είπε ο Λεωνίδας. Εσύ απλώς λαβέ το ποτήρι.",
      "Ακόμα και λίγη αφυδάτωση ρίχνει τη συγκέντρωση. Αν διάβασες αυτή τη φράση δύο φορές, ξέρεις γιατί.",
      "Μένουν {left}. Ο Σίσυφος είχε χειρότερη μέρα, αλλά όχι πολύ.",
      "Ένας ελέφαντας πίνει έως και 200 λίτρα τη μέρα. Δεν σου ζητάω τόσα, μόνο {left}.",
      "Το μπουκάλι σού κάνει νόημα από την άλλη άκρη του γραφείου. Κάνε πως δεν το είδες, αν αντέχεις.",
    ],
    evening: [
      "Η Πηνελόπη περίμενε είκοσι χρόνια. Ο στόχος σου περιμένει από το πρωί και αρχίζει να της μοιάζει.",
      "Μένουν {left}. Όχι όλα μαζί. Ο ύπνος σου δεν θέλει νυχτερινές εκδρομές στο μπάνιο.",
      "Ο Φειδιππίδης έτρεξε σαράντα χιλιόμετρα για ένα μήνυμα. Εσύ έχεις να περπατήσεις ως την κουζίνα.",
      "Η μέρα κλείνει. Ένα ποτήρι τώρα και το ημερολόγιο θα σε κρίνει με επιείκεια.",
      "Τα νεφρά σου φιλτράρουν περίπου 180 λίτρα την ημέρα. Το λιγότερο που μπορείς να κάνεις είναι να τους στείλεις ένα ποτήρι.",
      "Βράδυ, και ο στόχος ακόμα ανοιχτός. Σαν τα tabs του browser σου.",
      "Ο Οδυσσέας άργησε δέκα χρόνια και τον διαβάζουμε ακόμα. Εσύ άργησες λίγες ώρες, προλαβαίνεις.",
      "Αύριο το πρωί θα ξυπνήσεις λιγότερο στεγνός αν πιεις κάτι τώρα. Του το χρωστάς.",
      "Ο ήλιος έδυσε, ο στόχος όχι ακόμα. Υπάρχει χρόνος για ένα ποτήρι, όχι για τέσσερα.",
    ],
    onTrack: [
      "Ακριβώς στο πρόγραμμα. Ο Πυθαγόρας θα ενέκρινε την ακρίβεια.",
      "Πας καλά. Δεν το λέω εγώ, το λένε τα νούμερα, και αυτά δεν κολακεύουν κανέναν.",
      "Αυτό λέγεται συνέπεια. Βαρετό όνομα, εξαιρετικό αποτέλεσμα.",
      "«Μέτρον άριστον», έλεγε ο Κλεόβουλος. Ούτε λίγο ούτε πολύ, ακριβώς όπως πας.",
      "Στον Διεθνή Διαστημικό Σταθμό ανακυκλώνουν σχεδόν όλο το νερό, μέχρι και τον ιδρώτα. Εσύ το έχεις πιο εύκολο, έχεις βρύση.",
      "{total} μέχρι τώρα. Σταθερά, ήρεμα, σχεδόν βαρετά. Τέλεια.",
      "Ούτε μπροστά ούτε πίσω. Ο Αριστοτέλης θα το έλεγε μεσότητα.",
      "Τίποτα εντυπωσιακό, όλα σωστά. Έτσι χτίζονται οι συνήθειες. Και οι Παρθενώνες.",
      "Μένουν {left}. Με αυτόν τον ρυθμό, μπορώ να πάω για καφέ.",
      "Ένα αγγούρι είναι 96% νερό. Εσύ πας να το φτάσεις.",
      "Συνέχισε έτσι και δεν θα χρειαστεί να σου ξαναμιλήσω σήμερα. Το λέω με αγάπη.",
      "Ο Ηράκλειτος είπε ότι δεν μπαίνεις δύο φορές στο ίδιο ποτάμι. Στο ίδιο ποτήρι όμως, όσες φορές θες.",
    ],
    ahead: [
      "Πας τόσο γρήγορα που ο Ερμής ζητάει πίσω τα φτερωτά του σανδάλια.",
      "Τόσο νωρίς και ήδη {total}; Με κάνεις να νιώθω περιττός.",
      "Είσαι μπροστά από το πρόγραμμα. Μην το πεις στο ρολόι, θα στενοχωρηθεί.",
      "Με τέτοιο ρυθμό, η καμήλα σού ζητάει συμβουλές.",
      "Πρώτος στη βαθμολογία. Είσαι και ο μόνος παίκτης, αλλά μετράει.",
      "Δεν έχω τι να πω. Αυτό σπάνια μου συμβαίνει.",
      "Αν οι Ολυμπιακοί Αγώνες είχαν αγώνισμα ενυδάτωσης, θα σου φορούσαν ήδη στεφάνι ελιάς.",
      "Πας μπροστά. Ο στόχος αρχίζει να ανησυχεί.",
    ],
    almost: [
      "Οι Δαναΐδες γέμιζαν για πάντα ένα τρύπιο πιθάρι. Ο δικός σου στόχος έχει πάτο, και φαίνεται.",
      "Μένουν {left}. Ο Οδυσσέας βλέπει την Ιθάκη.",
      "Τόσο κοντά, που ήδη ετοιμάζω τα κομφετί.",
      "Σχεδόν. Και το «σχεδόν» θέλει μόνο ένα ποτήρι για να γίνει «έγινε».",
      "Μένουν {left}. Ο Σίσυφος θα έδινε τα πάντα για τόσο λίγη απόσταση από την κορυφή.",
      "Τελευταία ευθεία. Ο Φειδιππίδης σε αυτό το σημείο δεν σταμάτησε.",
      "Ο στόχος φαίνεται από εδώ. Κι εγώ φαίνομαι, να σε κοιτάω με προσμονή.",
      "Λίγο ακόμα και η σημερινή μέρα γράφεται στο ημερολόγιο με μπλε.",
    ],
    done: [
      "Στόχος πέτυχε. Ο Πίνδαρος θα σου έγραφε ωδή. Εγώ σου γράφω αυτό.",
      "Τα κατάφερες. Οι Δαναΐδες ζηλεύουν.",
      "Τέλος οι υπενθυμίσεις για σήμερα. Τις κέρδισες τίμια.",
      "Αποστολή εξετελέσθη. Ο Glou αποσύρεται ικανοποιημένος.",
      "Ο Οδυσσέας έφτασε στην Ιθάκη, εσύ στα {goal}. Δεν ξέρω ποιο ήταν πιο δύσκολο.",
      "Πέτυχες τον στόχο. Ο Τάνταλος σε κοιτάει και κλαίει.",
      "Ο στόχος έπεσε. Τώρα ό,τι πίνεις είναι μπόνους.",
      "Ο Αριστοτέλης έγραψε ότι η αρετή χτίζεται με τη συνήθεια. Σήμερα έβαλες ένα τούβλο.",
      "Νίκη. Χωρίς Θερμοπύλες, χωρίς Μαραθώνα, μόνο με ποτήρια.",
      "Στην Ολυμπία θα σου έδιναν κότινο. Εδώ παίρνεις ένα μπλε κουτάκι στο ημερολόγιο.",
      "Γέμισε ο στόχος. Γέμισα κι εγώ, από περηφάνια.",
    ],
    streak: [
      "{streak} μέρες στη σειρά. Ο Σίσυφος δεν τα κατάφερε ούτε μία.",
      "Σερί {streak} ημερών. Μην το σπάσεις για ένα ποτήρι.",
      "{streak} μέρες. Αν ήταν γυμναστήριο, θα σε χαιρετούσαν με το όνομά σου.",
      "{streak} συνεχόμενες μέρες. Κάποιοι το λένε πείσμα, εγώ το λέω ενυδάτωση.",
      "{streak} μέρες στη σειρά. Το σερί σου αρχίζει να αποκτά προσωπικότητα.",
    ],
    overflow: [
      "«Μηδέν άγαν», έγραφε στους Δελφούς. Ισχύει και για το νερό.",
      "Μέτρον άριστον. Ο στόχος έχει περάσει προ πολλού.",
      "Εντυπωσιακό. Αλλά δεν χρειάζεται να αδειάσεις και τη βρύση.",
      "Ξεπέρασες τον εαυτό σου. Και τον στόχο. Και λίγο τη λογική.",
      "Αρκετό νερό για σήμερα. Ο οργανισμός σου ξέρει να ζητήσει αν χρειαστεί.",
      "Ο Ποσειδώνας σε βλέπει και αναρωτιέται αν πρέπει να ανησυχεί για τη θέση του.",
    ],
    night: [
      "Νύχτα. Σε περιμένει ο Μορφέας, όχι το μπουκάλι.",
      "Αργά πια. Ένα ποτήρι στο κομοδίνο για το πρωί είναι καλή ιδέα.",
      "Ό,τι ήπιες, ήπιες. Αύριο ο στόχος ξεκινάει από το μηδέν, σαν τον Σίσυφο αλλά χωρίς βράχο.",
      "Ο Glou πάει για ύπνο. Πήγαινε κι εσύ.",
      "Νύχτα. Δεν θα σου στείλω υπενθύμιση τώρα, έχω κι εγώ αξιοπρέπεια.",
      "Καληνύχτα. Τώρα κυβερνάει η Νυξ, ο στόχος περιμένει ως το πρωί.",
    ],
    hot: [
      "Ο Ίκαρος πλησίασε πολύ τον ήλιο και το πλήρωσε. Με {temp}° σήμερα, ο ήλιος ήρθε μόνος του σε σένα.",
      "Σήμερα έχει {temp}°. Ο ιδρώτας φεύγει, το νερό πρέπει να έρθει.",
      "Με {temp}° έξω, ακόμα και η καμήλα θα ζητούσε σκιά.",
      "Καύσωνας σήμερα, γι' αυτό ο στόχος ανέβηκε λίγο. Δεν είναι προσωπικό.",
      "{temp}°. Μέρα για σκιά, νερό και όσο το δυνατόν λιγότερες σκάλες.",
      "Στη ζέστη, αν κινείσαι, μπορείς να χάσεις πάνω από ένα λίτρο ιδρώτα την ώρα. Ο λογαριασμός βγαίνει εύκολα.",
    ],
    cold: [
      "Στο κρύο δεν διψάς τόσο, αλλά το νερό το χρειάζεσαι σχεδόν το ίδιο.",
      "Ο Βορέας φυσάει σήμερα. Ένα ζεστό τσάι μετράει κι αυτό στον στόχο.",
      "Με {temp}° κανείς δεν σκέφτεται το νερό. Γι' αυτό είμαι εδώ.",
      "Το καλοριφέρ στεγνώνει τον αέρα. Και σένα, αν δεν πίνεις.",
      "Κρύο, κουβέρτα, τσάι. Το τσάι μετράει, η κουβέρτα όχι.",
    ],
    rain: [
      "Βρέχει. Ο Δίας κάνει τη δουλειά του. Κάνε κι εσύ τη δική σου.",
      "Βρέχει έξω, αλλά δυστυχώς αυτό δεν μετράει στον στόχο σου.",
      "Έξω βρέχει, μέσα ξεραίνεσαι. Ειρωνικό, ε;",
      "Ο ουρανός πίνει για όλους σήμερα. Εσύ πιες για σένα.",
      "Μέρα για σπίτι και τσάι. Το τσάι μετράει.",
    ],
    monday: [
      "Δευτέρα. Ο Σίσυφος ξεκινάει πάλι από κάτω. Εσύ τουλάχιστον ξεκινάς με νερό.",
      "Δευτέρα πρωί. Δεν θα τη μετατρέψουμε σε Παρασκευή, αλλά ένα ποτήρι βοηθάει.",
    ],
    friday: [
      "Παρασκευή. Ο Διόνυσος ετοιμάζεται για το βράδυ. Εσύ προετοιμάσου με νερό.",
      "Παρασκευή. Το Σαββατοκύριακο πλησιάζει, ο στόχος επίσης.",
    ],
    weekend: [
      "Σαββατοκύριακο. Το πρόγραμμα αλλάζει, η ανάγκη για νερό όχι.",
      "Ρεπό από τη δουλειά, όχι από το νερό.",
      "Βόλτα σήμερα; Ο Οδυσσέας δεν σάλπαρε ποτέ χωρίς προμήθειες. Πάρε το μπουκάλι.",
      "Ο Επίκουρος έλεγε ότι με ψωμί και νερό ζει κανείς ευτυχισμένος. Το ψωμί το έχεις ήδη.",
    ],
  },
  en: {
    morning: [
      "Thales said water is the origin of everything. The origin of your day was coffee, though.",
      "You slept for hours without water. Only camels do that with pride.",
      "You're about 60% water. In the morning, probably a bit less.",
      "The sun is up, the coffee is made. The water is still in the tap, waiting.",
      "Good morning. Your bottle has been waiting since last night, with the patience of Penelope.",
      "Your brain is about 75% water. Before you put it to work, top it up.",
      "Archimedes shouted \"Eureka\" in the water. You could start by finding a glass.",
      "Today's goal is {goal}. Heracles had twelve labours, you have one.",
      "A jellyfish is 95% water and doesn't even have a brain. You do, so drink.",
      "A morning without water is a phone on 5%. It works, but nervously.",
      "Good morning. Zero ml so far. One of the few scores a glass can fix.",
      "Pheidippides ran from Marathon to Athens. You just need to get out of bed.",
    ],
    behind: [
      "Tantalus was punished with water he couldn't drink. You can. What are you waiting for?",
      "In Hades they drank from the Lethe to forget. You forgot without drinking anything.",
      "Midas couldn't drink because water turned to gold. What's your excuse?",
      "Diogenes threw away his cup when he saw a child drink with its hands. You have a cup and don't use it.",
      "\"Everything flows\", said Heraclitus. Except the water in your glass, which hasn't moved since morning.",
      "I'm not saying you're dehydrated. I'm saying a camel is looking at you with concern.",
      "The goal is waiting. The bottle is waiting. I'm waiting. We're all waiting.",
      "Today you're drier than your dad's jokes.",
      "A big tree drinks hundreds of litres a day and doesn't even discuss it.",
      "Thirst kicks in once you've already lost some water. So if you're thirsty, you're late.",
      "Odysseus took ten years to get home. You're taking ten minutes to get to the kitchen.",
      "\"Come and take them\", said Leonidas. You just take the glass.",
      "Even mild dehydration hurts focus. If you read this sentence twice, now you know why.",
      "{left} to go. Sisyphus had a worse day, but not by much.",
      "An elephant drinks up to 200 litres a day. I'm not asking for that, just {left}.",
      "Your bottle is waving at you from across the desk. Pretend you didn't see it, if you can.",
    ],
    evening: [
      "Penelope waited twenty years. Your goal has been waiting since morning and is starting to look like her.",
      "{left} to go. Not all at once. Your sleep doesn't want night trips to the bathroom.",
      "Pheidippides ran forty kilometres for one message. You only need to walk to the kitchen.",
      "The day is closing. One glass now and the calendar will judge you kindly.",
      "Your kidneys filter about 180 litres a day. The least you can do is send them a glass.",
      "Evening, and the goal is still open. Like your browser tabs.",
      "Odysseus was ten years late and we still read about him. You're a few hours late, there's time.",
      "Tomorrow morning you'll wake up less dry if you drink something now. You owe yourself that.",
      "The sun has set, the goal hasn't. There's time for one glass, not for four.",
    ],
    onTrack: [
      "Right on schedule. Pythagoras would approve of the precision.",
      "You're doing well. Not my opinion, the numbers say so, and they flatter no one.",
      "That's called consistency. Boring name, excellent results.",
      "\"Moderation is best\", said Cleobulus. Not too little, not too much, just like you.",
      "On the space station they recycle almost all their water, sweat included. You have it easier: you have a tap.",
      "{total} so far. Steady, calm, almost boring. Perfect.",
      "Not ahead, not behind. Aristotle would call it the golden mean.",
      "Nothing flashy, everything right. That's how habits are built. And Parthenons.",
      "{left} to go. At this pace I can go for a coffee.",
      "A cucumber is 96% water. You're catching up.",
      "Keep this up and I won't need to speak to you again today. I say that with love.",
      "Heraclitus said you can't step into the same river twice. The same glass, as often as you like.",
    ],
    ahead: [
      "You're so fast that Hermes wants his winged sandals back.",
      "This early and already {total}? You're making me feel unnecessary.",
      "You're ahead of schedule. Don't tell the clock, it'll be upset.",
      "At this pace, camels are asking you for advice.",
      "First on the leaderboard. You're also the only player, but it counts.",
      "I've got nothing to say. That rarely happens to me.",
      "If the Olympics had a hydration event, you'd already be wearing the olive wreath.",
      "You're ahead. The goal is getting nervous.",
    ],
    almost: [
      "The Danaids filled a leaking jar for eternity. Your goal has a bottom, and you can see it.",
      "{left} to go. Odysseus can see Ithaca.",
      "So close I'm already getting the confetti ready.",
      "Almost. And \"almost\" needs just one glass to become \"done\".",
      "{left} to go. Sisyphus would give anything to be this close to the top.",
      "Final stretch. Pheidippides didn't stop at this point.",
      "The goal is in sight. So am I, watching you hopefully.",
      "A little more and today goes on the calendar in blue.",
    ],
    done: [
      "Goal reached. Pindar would write you an ode. I'm writing you this.",
      "You did it. The Danaids are jealous.",
      "No more reminders today. You earned it.",
      "Mission accomplished. Glou retires, satisfied.",
      "Odysseus reached Ithaca, you reached {goal}. Not sure which was harder.",
      "Goal reached. Tantalus is watching you and crying.",
      "Goal down. Everything you drink now is a bonus.",
      "Aristotle wrote that virtue is built by habit. Today you laid a brick.",
      "Victory. No Thermopylae, no Marathon, just glasses.",
      "At Olympia you'd get an olive wreath. Here you get a blue square on the calendar.",
      "The goal is full. So am I, with pride.",
    ],
    streak: [
      "{streak} days in a row. Sisyphus never managed even one.",
      "A {streak}-day streak. Don't break it over one glass.",
      "{streak} days. If this were a gym, they'd greet you by name.",
      "{streak} days running. Some call it stubbornness, I call it hydration.",
      "{streak} days in a row. Your streak is starting to have a personality.",
    ],
    overflow: [
      "\"Nothing in excess\", it said at Delphi. That goes for water too.",
      "Moderation is best. The goal was passed a while ago.",
      "Impressive. But you don't need to empty the tap as well.",
      "You outdid yourself. And the goal. And a bit of common sense.",
      "Enough water for today. Your body knows how to ask if it needs more.",
      "Poseidon is watching you and wondering if his job is safe.",
    ],
    night: [
      "Night time. Morpheus is waiting for you, not the bottle.",
      "Late now. A glass on the nightstand for the morning is a good idea.",
      "What you drank, you drank. Tomorrow the goal starts from zero, like Sisyphus without the boulder.",
      "Glou is off to bed. You should go too.",
      "Night time. I won't send you a reminder now, I have some dignity.",
      "Good night. Nyx rules now, the goal will wait until morning.",
    ],
    hot: [
      "Icarus flew too close to the sun and paid for it. At {temp}° today, the sun came to you instead.",
      "It's {temp}° today. Sweat goes out, water has to come in.",
      "At {temp}° outside, even a camel would ask for shade.",
      "Heatwave today, so the goal went up a bit. Nothing personal.",
      "{temp}°. A day for shade, water and as few stairs as possible.",
      "In the heat, if you're moving, you can sweat more than a litre an hour. The maths is easy.",
    ],
    cold: [
      "In the cold you feel less thirsty, but you need water almost as much.",
      "Boreas is blowing today. A hot tea counts towards the goal too.",
      "At {temp}° nobody thinks about water. That's why I'm here.",
      "Central heating dries the air. And you, if you don't drink.",
      "Cold, blanket, tea. The tea counts, the blanket doesn't.",
    ],
    rain: [
      "It's raining. Zeus is doing his job. Do yours.",
      "It's raining outside, but sadly that doesn't count towards your goal.",
      "Wet outside, drying out inside. Ironic, isn't it?",
      "The sky is drinking for everyone today. You drink for you.",
      "A day for home and tea. Tea counts.",
    ],
    monday: [
      "Monday. Sisyphus starts from the bottom again. At least you start with water.",
      "Monday morning. We can't turn it into Friday, but a glass helps.",
    ],
    friday: [
      "Friday. Dionysus is getting ready for tonight. You get ready with water.",
      "Friday. The weekend is close, and so is the goal.",
    ],
    weekend: [
      "Weekend. The schedule changes, the need for water doesn't.",
      "A day off work, not off water.",
      "Going out? Odysseus never set sail without supplies. Take the bottle.",
      "Epicurus said bread and water are enough for a happy life. You already have the bread.",
    ],
  },
}

export function lineCategory({ total, goal, now, wakeStart, wakeEnd }) {
  const minute = minutesOfDay(now)
  const start = parseTime(wakeStart)
  const end = parseTime(wakeEnd)
  const awake = end > start ? minute >= start && minute < end : minute >= start || minute < end
  const share = goal > 0 ? total / goal : 0
  if (share >= 1.4) return 'overflow'
  if (share >= 1) return 'done'
  if (!awake) return total === 0 && minute < start && start - minute <= 120 ? 'morning' : 'night'
  const expected = expectedFraction(now, wakeStart, wakeEnd)
  if (total === 0 && expected < 0.2) return 'morning'
  if (share >= 0.8) return 'almost'
  if (share < expected - 0.15) return expected > 0.7 ? 'evening' : 'behind'
  if (share > expected + 0.15) return 'ahead'
  return 'onTrack'
}

const EXTRAS = new Set(['morning', 'behind', 'onTrack', 'ahead'])

export function lineOptions(language, context) {
  const lines = LINES[language] || LINES.el
  const category = lineCategory(context)
  const options = [...lines[category]]
  const { weather, streak = 0, now } = context
  if (category === 'done' && streak >= 2) options.push(...lines.streak, ...lines.streak)
  if (EXTRAS.has(category)) {
    if (weather?.max >= 30) options.push(...lines.hot)
    else if (weather?.rain) options.push(...lines.rain)
    else if (weather && weather.max <= 12) options.push(...lines.cold)
    const weekday = now.getDay()
    if (weekday === 1 && category === 'morning') options.push(...lines.monday)
    if (weekday === 5) options.push(...lines.friday)
    if (weekday === 0 || weekday === 6) options.push(...lines.weekend)
    if (streak >= 3) options.push(lines.streak[0])
  }
  return { category, options }
}

export function fill(text, values) {
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match))
}

export function glouLine(language, context, values, turn = 0) {
  const { category, options } = lineOptions(language, context)
  const start = tipIndex(`${dayKey(context.now)}|${context.total}|${category}`, options.length)
  return fill(options[(start + turn) % options.length], { ...values, streak: context.streak, temp: context.weather?.max })
}

export function allLines() {
  return LINES
}
