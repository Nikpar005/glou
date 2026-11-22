import { dayKey, minutesOfDay, parseTime } from './dates.js'
import { expectedFraction } from './mood.js'
import { tipIndex } from './tips.js'

const LINES = {
  el: {
    morning: [
      "Καλημέρα. Ένα ποτήρι τώρα και η μέρα ξεκινάει με προβάδισμα.",
      "Κοιμήθηκες ώρες χωρίς νερό. Λογικό να σε περιμένω.",
      "Πριν τον καφέ, ένα νερό. Ο καφές δεν θα παρεξηγηθεί.",
      "Το πρώτο ποτήρι της μέρας είναι το πιο εύκολο. Και μετράει όσο και τα άλλα.",
      "Καλημέρα. Το μπουκάλι είναι εκεί που το άφησες χθες.",
      "Η μέρα είναι ακόμα άδεια. Το ποτήρι επίσης.",
      "Ξεκίνα με νερό. Όλα τα υπόλοιπα μπορούν να περιμένουν ένα λεπτό.",
      "Σημερινός στόχος: {goal}. Το πρώτο ποτήρι είναι πάντα το πιο ωραίο.",
      "Τα μάτια ξύπνησαν. Ας ξυπνήσει και το υπόλοιπο σώμα.",
      "Καλημέρα. Δεν ζητάω πολλά, μόνο 250 ml για αρχή.",
      "Νέα μέρα, μηδέν ml, άπειρες δυνατότητες.",
      "Ό,τι κι αν έχεις σήμερα στο πρόγραμμα, ένα ποτήρι νερό χωράει.",
      "Πρωί χωρίς νερό είναι σαν κινητό στο 5%. Δουλεύει, αλλά με άγχος.",
      "Πριν ανοίξεις τα μηνύματα, άνοιξε το μπουκάλι.",
      "Οι καλές μέρες ξεκινάνε με απλά πράγματα. Για παράδειγμα, ένα ποτήρι νερό.",
      "Το σώμα σου ξύπνησε διψασμένο. Απλώς δεν το λέει δυνατά.",
      "Αν το διαβάζεις ακόμα στο κρεβάτι, το ποτήρι στο κομοδίνο μετράει κανονικά.",
      "Καλημέρα. Στόχος {goal}, και η αρχή γίνεται τώρα.",
    ],
    behind: [
      "Είμαστε λίγο πίσω. Τίποτα που δεν διορθώνει ένα ποτήρι.",
      "Μένουν {left}. Ακούγεται πολύ, αλλά είναι λίγα ποτήρια.",
      "Αν διψάς ήδη, άργησες λίγο. Αν όχι, ακόμα καλύτερα: πιες τώρα.",
      "Το ρολόι τρέχει πιο γρήγορα από το ποτήρι σου.",
      "Ψάχνω νερό και βρίσκω μόνο καλές προθέσεις.",
      "Δεν σε κατηγορώ. Απλώς σε κοιτάζω. Κρατώντας ένα άδειο ποτήρι.",
      "Ένα ποτήρι τώρα, ένα με το επόμενο φαγητό, και πιάσαμε ξανά ρυθμό.",
      "Η κούραση του απογεύματος καμιά φορά είναι απλώς δίψα.",
      "Το μπουκάλι σού κάνει νόημα από την άλλη άκρη του γραφείου.",
      "Πίσω από το πρόγραμμα, αλλά όχι εκτός αγώνα.",
      "Λίγο νερό τώρα είναι πιο εύκολο από πολύ νερό το βράδυ.",
      "Σήμερα με ξέχασες λίγο. Δεν πειράζει, εγώ δεν σε ξέχασα.",
      "Το πρόγραμμα λέει ότι θα έπρεπε να έχεις πιει περισσότερο. Εγώ απλώς το μεταφέρω.",
      "Δεν είναι αργά. Είναι ακριβώς η ώρα για ένα ποτήρι.",
      "Δύο ποτήρια τώρα και ξαναμπαίνεις στο παιχνίδι.",
      "Δουλεύεις πολύ, πίνεις λίγο. Ας το ισορροπήσουμε.",
      "Το νερό δεν πίνεται μόνο του, δυστυχώς. Το έχω ψάξει.",
      "Ένα διάλειμμα για νερό κάνει περισσότερα από έναν ακόμα καφέ.",
      "Αν ξεχάστηκες, δεν πειράζει. Γι' αυτό υπάρχω.",
      "Λίγο πίσω, αλλά ο στόχος είναι ακόμα απόλυτα εφικτός.",
      "Μένουν {left}. Μη σκέφτεσαι τα λίτρα, σκέψου μόνο το επόμενο ποτήρι.",
      "Ο εγκέφαλος δουλεύει καλύτερα με νερό. Κι εγώ το ίδιο.",
    ],
    evening: [
      "Μένουν {left}. Μοίρασέ τα σε μικρά ποτήρια, όχι σε ένα μεγάλο κατόρθωμα.",
      "Το βράδυ δεν είναι ώρα για ρεκόρ. Ένα δυο ποτήρια, και αύριο νωρίτερα.",
      "Μην τα πιεις όλα τώρα. Ο ύπνος σου θα το εκτιμήσει.",
      "Βαριά μέρα, φαίνεται. Ένα ποτήρι και κλείνουμε τίμια.",
      "Η μέρα τελειώνει, ο στόχος όχι ακόμα. Λίγο ακόμα;",
      "Δεν θα τα προλάβουμε όλα απόψε, και δεν χρειάζεται. Ένα ποτήρι αρκεί.",
      "Δύο ποτήρια ως τον ύπνο και η μέρα σώζεται. Τα υπόλοιπα, αύριο.",
      "Το βράδυ μετράει κι αυτό. Μικρές γουλιές, χωρίς βιασύνη.",
      "Ο αυριανός εαυτός σου θα ξυπνήσει πιο φρέσκος αν πιεις ένα ποτήρι τώρα.",
      "Αύριο ξεκινάμε πιο νωρίς. Σήμερα, ένα τελευταίο ποτήρι.",
      "Ό,τι δεν γίνει σήμερα, το ξεκινάμε αύριο από το πρωί. Ένα ποτήρι όμως τώρα.",
    ],
    onTrack: [
      "Ακριβώς στο πρόγραμμα. Σπάνιο πράγμα, να το χαίρεσαι.",
      "Ωραίος ρυθμός. Αν συνεχίσεις έτσι, δεν θα με ακούσεις σήμερα.",
      "Πας καλά. Δεν το λέω εγώ, το λένε τα νούμερα.",
      "{total} μέχρι τώρα. Σταθερά και χωρίς φασαρία.",
      "Αυτό λέγεται συνέπεια. Βαρετό όνομα, εξαιρετικό αποτέλεσμα.",
      "Δεν θέλω τίποτα. Ήρθα μόνο να πω ότι τα πας καλά.",
      "Ένα ποτήρι κάθε λίγο είναι όλο το μυστικό. Το έχεις.",
      "Ούτε μπροστά ούτε πίσω. Ακριβώς εκεί που πρέπει.",
      "Μένουν {left}. Με αυτόν τον ρυθμό τελειώνεις πριν το βράδυ.",
      "Σταθερός ρυθμός. Ο στόχος έρχεται χωρίς καν να το καταλάβεις.",
      "Αν το νερό ήταν μάθημα, θα έπαιρνες άριστα στη συνέπεια.",
      "Όλα κυλάνε. Κυριολεκτικά.",
      "Τίποτα εντυπωσιακό, όλα σωστά. Έτσι χτίζονται οι συνήθειες.",
      "Είσαι ακριβώς εκεί που θα ήθελα να είσαι αυτή την ώρα.",
      "{total} ως τώρα, {left} ακόμα. Ήρεμα και σταθερά.",
      "Δεν χρειάζεται να σε ενοχλήσω σήμερα. Μου αρέσει αυτό.",
      "Κάπως έτσι μοιάζει μια καλή μέρα, μετρημένη σε ml.",
      "Συνέχισε έτσι και το βράδυ θα γιορτάζουμε.",
    ],
    ahead: [
      "Είσαι μπροστά από το πρόγραμμα. Μην το πεις στο ρολόι.",
      "Τόσο νωρίς και ήδη {total}; Με κάνεις να νιώθω περιττός.",
      "Προβάδισμα. Τώρα μπορείς να χαλαρώσεις λίγο. Λίγο.",
      "Πας πιο γρήγορα από ό,τι υπολόγιζα. Ωραία έκπληξη.",
      "Με τέτοιο ρυθμό, σήμερα δεν θα χρειαστεί να σου θυμίσω τίποτα.",
      "Αν όλα πήγαιναν τόσο καλά όσο το νερό σου σήμερα…",
      "Πας μπροστά. Ο στόχος αρχίζει να ανησυχεί.",
      "Με τέτοια ταχύτητα θα τελειώσεις πριν το απόγευμα.",
      "Πρώτος στη βαθμολογία. Είσαι και ο μόνος παίκτης, αλλά μετράει.",
      "Σήμερα είσαι σε φόρμα. Και ενυδατωμένος.",
      "Δεν έχω τι να πω. Αυτό σπάνια μου συμβαίνει.",
    ],
    almost: [
      "Μένουν μόνο {left}. Ένα ποτήρι, ίσως δύο.",
      "Βλέπω τη γραμμή του τερματισμού.",
      "Τόσο κοντά, που θα ήταν κρίμα να το αφήσεις εδώ.",
      "Άλλα {left} και η σημερινή μέρα γίνεται μπλε στο ημερολόγιο.",
      "Τελευταία ευθεία. Χωρίς βιασύνη, απλώς μη σταματήσεις.",
      "Σχεδόν. Και το «σχεδόν» θέλει μόνο ένα ποτήρι για να γίνει «έγινε».",
      "Λίγο ακόμα και ο στόχος γίνεται παρελθόν.",
      "Μένουν {left}. Ουσιαστικά ένα ποτήρι και λίγη θέληση.",
      "Ο στόχος φαίνεται από εδώ. Πάμε;",
      "Τόσο κοντά, που ήδη ετοιμάζω τα κομφετί.",
      "Ένα τελευταίο ποτήρι και κλείνουμε τη μέρα με επιτυχία.",
    ],
    done: [
      "Ο στόχος πέτυχε. Από εδώ και πέρα πίνεις όταν διψάς, χωρίς εμένα.",
      "Τα κατάφερες. Η σημερινή μέρα πάει στο ημερολόγιο με μπλε.",
      "Τέλος οι υπενθυμίσεις για σήμερα. Τις κέρδισες τίμια.",
      "Αποστολή εξετελέσθη. Ο Glou αποσύρεται ικανοποιημένος.",
      "Σήμερα έκανες κάτι καλό για σένα, σχεδόν χωρίς να το καταλάβεις.",
      "Πέτυχες τον στόχο. Αύριο τα ίδια, και θα γίνει συνήθεια.",
      "Ο στόχος έπεσε. Τώρα ό,τι πίνεις είναι μπόνους.",
      "Στόχος εντάξει. Σήμερα δεν έχω άλλη δουλειά.",
      "Ολοκληρώθηκε. Πάρε ένα μπράβο, το αξίζεις.",
      "Σήμερα ήσουν συνεπής. Αυτό μετράει περισσότερο από τα λίτρα.",
      "Τέλεια μέρα σε νερό. Το υπόλοιπο της μέρας είναι δικό σου.",
      "Γέμισε ο στόχος. Γέμισα κι εγώ, από περηφάνια.",
    ],
    streak: [
      "{streak} μέρες στη σειρά. Αυτό δεν είναι πια τύχη, είναι συνήθεια.",
      "Σερί {streak} ημερών. Μην το σπάσεις για ένα ποτήρι.",
      "{streak} μέρες. Αν ήταν γυμναστήριο, θα σε χαιρετούσαν με το όνομά σου.",
      "{streak} μέρες στη σειρά. Το σερί σου αρχίζει να αποκτά προσωπικότητα.",
      "{streak} συνεχόμενες μέρες. Κάποιοι το λένε πείσμα, εγώ το λέω ενυδάτωση.",
    ],
    overflow: [
      "Τον στόχο τον ξεπέρασες με διαφορά. Από εδώ και πέρα, πίνε μόνο όταν διψάς.",
      "Περισσότερο δεν σημαίνει πάντα καλύτερο. Σήμερα είσαι μια χαρά.",
      "Εντυπωσιακό. Αλλά δεν χρειάζεται να αδειάσεις και τη βρύση.",
      "Ο στόχος πέρασε πριν ώρα. Από εδώ και πέρα, μόνο αν διψάς.",
      "Ξεπέρασες τον εαυτό σου. Και τον στόχο. Και λίγο τη λογική.",
      "Αρκετό νερό για σήμερα. Ο οργανισμός σου ξέρει να ζητήσει αν χρειαστεί.",
    ],
    night: [
      "Είναι αργά. Ένα μικρό ποτήρι αν διψάς, και ύπνο.",
      "Ώρα για ύπνο. Τους λογαριασμούς τους κάνουμε αύριο.",
      "Νύχτα. Ούτε εγώ θα σου στείλω υπενθύμιση τώρα.",
      "Ό,τι ήπιες, ήπιες. Το αύριο ξεκινάει από το μηδέν και από ένα ποτήρι.",
      "Καληνύχτα. Αύριο ο στόχος ξεκινάει από την αρχή.",
      "Αργά πια. Ένα ποτήρι στο κομοδίνο για το πρωί είναι καλή ιδέα.",
      "Ο Glou πάει για ύπνο. Πήγαινε κι εσύ.",
      "Η μέρα έκλεισε. Τα υπόλοιπα, αύριο.",
    ],
    hot: [
      "Σήμερα έχει {temp}°. Ο ιδρώτας φεύγει, το νερό πρέπει να έρθει.",
      "Με {temp}° έξω, το νερό είναι ο κλιματισμός σου από μέσα.",
      "Ζέστη. Κράτα το μπουκάλι κοντά σου, αλλά όχι στον ήλιο.",
      "Καύσωνας σήμερα, γι' αυτό ο στόχος ανέβηκε λίγο. Δεν είναι προσωπικό.",
      "{temp}°. Μέρα για σκιά, νερό και όσο το δυνατόν λιγότερες σκάλες.",
      "Με τέτοια ζέστη, η δίψα έρχεται πιο γρήγορα. Πρόλαβέ τη.",
    ],
    cold: [
      "Στο κρύο δεν διψάς τόσο, αλλά το νερό το χρειάζεσαι σχεδόν το ίδιο.",
      "Κρύο έξω. Ένα ζεστό τσάι μετράει κι αυτό στο νερό της ημέρας.",
      "Με {temp}° κανείς δεν σκέφτεται το νερό. Γι' αυτό είμαι εδώ.",
      "Το καλοριφέρ στεγνώνει τον αέρα. Και σένα, αν δεν πίνεις.",
      "Κρύο, κουβέρτα, τσάι. Το τσάι μετράει, η κουβέρτα όχι.",
    ],
    rain: [
      "Βρέχει έξω, αλλά δυστυχώς αυτό δεν μετράει στον στόχο σου.",
      "Μέρα για σπίτι και τσάι. Το τσάι μετράει.",
      "Ο ουρανός πίνει για όλους σήμερα. Εσύ πιες για σένα.",
      "Βροχή. Το μόνο νερό που χρειάζεσαι είναι αυτό στο ποτήρι.",
      "Έξω βρέχει, μέσα ξεραίνεσαι. Ειρωνικό, ε;",
    ],
    monday: [
      "Δευτέρα. Ξεκίνα την εβδομάδα με κάτι που σίγουρα θα πετύχει: ένα ποτήρι νερό.",
      "Δευτέρα πρωί. Δεν θα την κάνουμε Παρασκευή, αλλά ένα ποτήρι βοηθάει.",
    ],
    friday: [
      "Παρασκευή. Το Σαββατοκύριακο πλησιάζει, ο στόχος επίσης.",
      "Παρασκευή. Κλείσε την εβδομάδα με ένα πλήρες σκορ.",
    ],
    weekend: [
      "Σαββατοκύριακο. Το πρόγραμμα αλλάζει, η ανάγκη για νερό όχι.",
      "Ρεπό από τη δουλειά, όχι από το νερό.",
      "Χαλαρή μέρα. Ιδανική για να πίνεις χωρίς να το σκέφτεσαι.",
      "Βόλτα σήμερα; Το μπουκάλι έρχεται μαζί.",
    ],
  },
  en: {
    morning: [
      "Good morning. One glass now and the day starts with a lead.",
      "You slept for hours without water. Fair enough that I'm waiting.",
      "Water before coffee. Coffee won't take it personally.",
      "The first glass of the day is the easiest. It counts just as much.",
      "Good morning. Your bottle is right where you left it yesterday.",
      "The day is still empty. So is the glass.",
      "Start with water. Everything else can wait a minute.",
      "Today's goal: {goal}. The first glass is always the nicest.",
      "Your eyes are awake. Let's wake up the rest of you.",
      "Good morning. I'm not asking for much, just 250 ml to begin.",
      "New day, zero ml, endless possibilities.",
      "Whatever's on your plate today, a glass of water fits in.",
      "A morning without water is a phone on 5%. It works, but nervously.",
      "Before you open your messages, open your bottle.",
      "Good days start with simple things. A glass of water, for example.",
      "Your body woke up thirsty. It just doesn't say so out loud.",
      "If you're still reading this in bed, the glass on the nightstand counts.",
      "Good morning. Goal: {goal}, and it starts now.",
    ],
    behind: [
      "We're a little behind. Nothing a glass can't fix.",
      "{left} to go. Sounds like a lot, but it's only a few glasses.",
      "If you're already thirsty, you're a bit late. If not, even better: drink now.",
      "The clock is moving faster than your glass.",
      "I'm looking for water and finding only good intentions.",
      "I'm not blaming you. I'm just looking at you. Holding an empty glass.",
      "One glass now, one with your next meal, and we're back on track.",
      "That afternoon slump is sometimes just thirst.",
      "Your bottle is waving at you from across the desk.",
      "Behind schedule, but not out of the race.",
      "A little water now is easier than a lot of water tonight.",
      "You forgot about me a bit today. That's fine, I didn't forget you.",
      "The schedule says you should have had more by now. I'm just the messenger.",
      "It's not late. It's exactly the right time for a glass.",
      "Two glasses now and you're back in the game.",
      "Working a lot, drinking a little. Let's balance that.",
      "Sadly, water doesn't drink itself. I've checked.",
      "A water break does more than another coffee.",
      "If you got carried away, that's fine. That's why I'm here.",
      "A bit behind, but the goal is still completely doable.",
      "{left} to go. Forget the litres, think only about the next glass.",
      "Your brain works better with water. So do I.",
    ],
    evening: [
      "{left} to go. Split it into small glasses, not one big heroic effort.",
      "Evening is no time for records. A glass or two, and earlier tomorrow.",
      "Don't drink it all now. Your sleep will thank you.",
      "Long day, it seems. One glass and we call it a fair finish.",
      "The day is ending, the goal isn't met yet. A little more?",
      "We won't make it all up tonight, and we don't have to. One glass is enough.",
      "Two glasses before bed and the day is saved. The rest, tomorrow.",
      "Evenings count too. Small sips, no rush.",
      "Tomorrow's you will wake up fresher if you drink a glass now.",
      "Tomorrow we start earlier. Today, one last glass.",
      "Whatever doesn't happen today, we start again tomorrow morning. One glass now, though.",
    ],
    onTrack: [
      "Right on schedule. That's rare, enjoy it.",
      "Nice pace. Keep this up and you won't hear from me today.",
      "You're doing well. Not my opinion, the numbers say so.",
      "{total} so far. Steady and without fuss.",
      "That's called consistency. Boring name, excellent results.",
      "I don't want anything. Just came to say you're doing well.",
      "A glass every so often is the whole secret. You've got it.",
      "Not ahead, not behind. Exactly where you should be.",
      "{left} to go. At this pace you'll be done before evening.",
      "Steady pace. The goal will arrive before you notice.",
      "If water were a subject, you'd get top marks for consistency.",
      "Everything's flowing. Literally.",
      "Nothing flashy, everything right. That's how habits are built.",
      "You're exactly where I'd hope you'd be at this hour.",
      "{total} so far, {left} to go. Calm and steady.",
      "I don't need to bother you today. I like that.",
      "This is what a good day looks like, measured in ml.",
      "Keep this up and tonight we celebrate.",
    ],
    ahead: [
      "You're ahead of schedule. Don't tell the clock.",
      "This early and already {total}? You're making me feel unnecessary.",
      "A lead. Now you can relax a little. A little.",
      "You're faster than I expected. Nice surprise.",
      "At this rate I won't need to remind you of anything today.",
      "If only everything went as well as your water today…",
      "You're ahead. The goal is getting nervous.",
      "At this speed you'll be done before the afternoon.",
      "First on the leaderboard. You're also the only player, but it counts.",
      "You're on form today. And hydrated.",
      "I've got nothing to say. That rarely happens to me.",
    ],
    almost: [
      "Only {left} left. One glass, maybe two.",
      "I can see the finish line.",
      "So close it would be a shame to stop here.",
      "Another {left} and today turns blue on the calendar.",
      "Final stretch. No rush, just don't stop.",
      "Almost. And \"almost\" needs just one glass to become \"done\".",
      "A little more and the goal is history.",
      "{left} to go. Basically one glass and a bit of willpower.",
      "You can see the goal from here. Shall we?",
      "So close I'm already getting the confetti ready.",
      "One last glass and the day ends in success.",
    ],
    done: [
      "Goal reached. From here on, drink when you're thirsty, no help needed.",
      "You did it. Today goes on the calendar in blue.",
      "No more reminders today. You earned it.",
      "Mission accomplished. Glou retires, satisfied.",
      "You did something good for yourself today, almost without noticing.",
      "Goal reached. Same again tomorrow, and it becomes a habit.",
      "Goal down. Everything you drink now is a bonus.",
      "Goal done. I have nothing else to do today.",
      "Complete. Take a well-deserved well done.",
      "You were consistent today. That matters more than the litres.",
      "A perfect water day. The rest of the day is yours.",
      "The goal is full. So am I, with pride.",
    ],
    streak: [
      "{streak} days in a row. That's not luck any more, it's a habit.",
      "A {streak}-day streak. Don't break it over one glass.",
      "{streak} days. If this were a gym, they'd greet you by name.",
      "{streak} days in a row. Your streak is starting to have a personality.",
      "{streak} days running. Some call it stubbornness, I call it hydration.",
    ],
    overflow: [
      "You passed your goal by a mile. From here on, drink only when you're thirsty.",
      "More isn't always better. You're doing great today.",
      "Impressive. But you don't need to empty the tap as well.",
      "The goal was passed a while ago. From now on, only if you're thirsty.",
      "You outdid yourself. And the goal. And a bit of common sense.",
      "Enough water for today. Your body knows how to ask if it needs more.",
    ],
    night: [
      "It's late. A small glass if you're thirsty, then sleep.",
      "Time for bed. We'll do the maths tomorrow.",
      "Night time. Even I won't send you a reminder now.",
      "What you drank, you drank. Tomorrow starts from zero and one glass.",
      "Good night. Tomorrow the goal starts fresh.",
      "Late now. A glass on the nightstand for the morning is a good idea.",
      "Glou is off to bed. You should go too.",
      "The day is done. The rest, tomorrow.",
    ],
    hot: [
      "It's {temp}° today. Sweat goes out, water has to come in.",
      "With {temp}° outside, water is your air conditioning from the inside.",
      "Hot one. Keep your bottle close, just not in the sun.",
      "Heatwave today, so the goal went up a bit. Nothing personal.",
      "{temp}°. A day for shade, water and as few stairs as possible.",
      "In this heat thirst comes faster. Get ahead of it.",
    ],
    cold: [
      "In the cold you feel less thirsty, but you need water almost as much.",
      "Cold outside. A hot tea counts towards today's water too.",
      "At {temp}° nobody thinks about water. That's why I'm here.",
      "Central heating dries the air. And you, if you don't drink.",
      "Cold, blanket, tea. The tea counts, the blanket doesn't.",
    ],
    rain: [
      "It's raining outside, but sadly that doesn't count towards your goal.",
      "A day for home and tea. Tea counts.",
      "The sky is drinking for everyone today. You drink for you.",
      "Rain. The only water you need is the one in your glass.",
      "Wet outside, drying out inside. Ironic, isn't it?",
    ],
    monday: [
      "Monday. Start the week with something that's sure to work: a glass of water.",
      "Monday morning. We can't turn it into Friday, but a glass helps.",
    ],
    friday: [
      "Friday. The weekend is close, and so is the goal.",
      "Friday. Finish the week with a full score.",
    ],
    weekend: [
      "Weekend. The schedule changes, the need for water doesn't.",
      "A day off work, not off water.",
      "A slow day. Perfect for drinking without thinking about it.",
      "Going out? The bottle comes too.",
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
