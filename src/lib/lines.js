import { dayKey, minutesOfDay, parseTime } from './dates.js'
import { expectedFraction } from './mood.js'
import { tipIndex } from './tips.js'

const LINES = {
  el: {
    morning: [
      'Καλημέρα. Ένα ποτήρι τώρα και η μέρα ξεκινάει με προβάδισμα.',
      'Κοιμήθηκες ώρες χωρίς νερό. Λογικό να σε περιμένω.',
      'Πριν τον καφέ, ένα νερό. Ο καφές δεν θα παρεξηγηθεί.',
      'Το πρώτο ποτήρι της μέρας είναι το πιο εύκολο. Και μετράει όσο και τα άλλα.',
      'Καλημέρα. Το μπουκάλι είναι εκεί που το άφησες χθες.',
      'Η μέρα είναι ακόμα άδεια. Το ποτήρι επίσης.',
      'Ξεκίνα με νερό. Όλα τα υπόλοιπα μπορούν να περιμένουν ένα λεπτό.',
      'Σήμερα ο στόχος είναι {goal}. Το πρώτο ποτήρι είναι το δικό μου αγαπημένο.',
      'Τα μάτια ξύπνησαν. Ας ξυπνήσει και το υπόλοιπο σώμα.',
      'Καλημέρα. Δεν ζητάω πολλά, μόνο 250 ml για αρχή.',
    ],
    behind: [
      'Είμαστε λίγο πίσω. Τίποτα που δεν διορθώνει ένα ποτήρι.',
      'Μένουν {left}. Ακούγεται πολύ, αλλά είναι λίγα ποτήρια.',
      'Αν διψάς ήδη, άργησες λίγο. Αν όχι, ακόμα καλύτερα: πιες τώρα.',
      'Το ρολόι τρέχει πιο γρήγορα από το ποτήρι σου.',
      'Ψάχνω νερό και βρίσκω μόνο καλές προθέσεις.',
      'Δεν σε κατηγορώ. Απλώς σε κοιτάζω. Κρατώντας ένα άδειο ποτήρι.',
      'Ένα ποτήρι τώρα, ένα με το επόμενο φαγητό, και πιάσαμε ξανά ρυθμό.',
      'Η κούραση του απογεύματος καμιά φορά είναι απλώς δίψα.',
      'Το μπουκάλι σού κάνει νόημα από την άλλη άκρη του γραφείου.',
      'Πίσω από το πρόγραμμα, αλλά όχι εκτός αγώνα.',
      'Λίγο νερό τώρα είναι πιο εύκολο από πολύ νερό το βράδυ.',
      'Σήμερα με ξέχασες λίγο. Δεν πειράζει, εγώ δεν σε ξέχασα.',
    ],
    evening: [
      'Μένουν {left}. Μοίρασέ τα σε μικρά ποτήρια, όχι σε ένα μεγάλο κατόρθωμα.',
      'Το βράδυ δεν είναι ώρα για ρεκόρ. Ένα δυο ποτήρια, και αύριο νωρίτερα.',
      'Μην τα πιεις όλα τώρα. Ο ύπνος σου θα το εκτιμήσει.',
      'Βαριά μέρα, φαίνεται. Ένα ποτήρι και κλείνουμε τίμια.',
      'Ό,τι δεν γίνει σήμερα, το ξεκινάμε αύριο από το πρωί. Ένα ποτήρι όμως τώρα.',
      'Η μέρα τελειώνει, το δαχτυλίδι όχι ακόμα. Λίγο ακόμα;',
    ],
    onTrack: [
      'Ακριβώς στο πρόγραμμα. Σπάνιο πράγμα, να το χαίρεσαι.',
      'Ωραίος ρυθμός. Αν συνεχίσεις έτσι, δεν θα με ακούσεις σήμερα.',
      'Πας καλά. Δεν το λέω εγώ, το λένε τα νούμερα.',
      '{total} μέχρι τώρα. Σταθερά και χωρίς φασαρία.',
      'Αυτό λέγεται συνέπεια. Βαρετό όνομα, εξαιρετικό αποτέλεσμα.',
      'Δεν θέλω τίποτα. Ήρθα μόνο να πω ότι τα πας καλά.',
      'Ένα ποτήρι κάθε λίγο είναι όλο το μυστικό. Το έχεις.',
      'Ούτε μπροστά ούτε πίσω. Ακριβώς εκεί που πρέπει.',
      'Μένουν {left}. Με αυτόν τον ρυθμό τελειώνεις πριν το βράδυ.',
      'Ό,τι χρειάζεται ο οργανισμός σου, το παίρνει πριν το ζητήσει. Έτσι μπράβο.',
    ],
    ahead: [
      'Είσαι μπροστά από το πρόγραμμα. Μην το πεις στο ρολόι.',
      'Τόσο νωρίς και ήδη {total}; Με κάνεις να νιώθω περιττός.',
      'Προβάδισμα. Τώρα μπορείς να χαλαρώσεις λίγο. Λίγο.',
      'Πας πιο γρήγορα από ό,τι υπολόγιζα. Ωραία έκπληξη.',
      'Με τέτοιο ρυθμό, σήμερα δεν θα χρειαστεί να σου θυμίσω τίποτα.',
      'Αν όλα πήγαιναν τόσο καλά όσο το νερό σου σήμερα…',
    ],
    almost: [
      'Μένουν μόνο {left}. Ένα ποτήρι, ίσως δύο.',
      'Βλέπω τη γραμμή του τερματισμού.',
      'Τόσο κοντά, που θα ήταν κρίμα να το αφήσεις εδώ.',
      'Άλλα {left} και η σημερινή μέρα γίνεται μπλε στο ημερολόγιο.',
      'Τελευταία ευθεία. Χωρίς βιασύνη, απλώς μη σταματήσεις.',
      'Σχεδόν. Και το «σχεδόν» θέλει μόνο ένα ποτήρι για να γίνει «έγινε».',
    ],
    done: [
      'Ο στόχος πέτυχε. Από εδώ και πέρα πίνεις όταν διψάς, χωρίς εμένα.',
      'Τα κατάφερες. Η σημερινή μέρα πάει στο ημερολόγιο με μπλε.',
      'Τέλος οι υπενθυμίσεις για σήμερα. Τις κέρδισες τίμια.',
      'Αποστολή εξετελέσθη. Ο Glou αποσύρεται ικανοποιημένος.',
      'Σήμερα έκανες κάτι καλό για σένα, σχεδόν χωρίς να το καταλάβεις.',
      'Γεμάτο το δαχτυλίδι. Γεμάτος κι εγώ, από περηφάνια.',
      'Πέτυχες τον στόχο. Αύριο τα ίδια, και θα γίνει συνήθεια.',
    ],
    streak: [
      '{streak} μέρες στη σειρά. Αυτό δεν είναι πια τύχη, είναι συνήθεια.',
      'Σερί {streak} ημερών. Μην το σπάσεις για ένα ποτήρι.',
      '{streak} μέρες. Αν ήταν γυμναστήριο, θα σε χαιρετούσαν με το όνομά σου.',
    ],
    overflow: [
      'Τον στόχο τον ξεπέρασες με διαφορά. Από εδώ και πέρα, πίνε μόνο όταν διψάς.',
      'Περισσότερο δεν σημαίνει πάντα καλύτερο. Σήμερα είσαι μια χαρά.',
      'Εντυπωσιακό. Αλλά δεν χρειάζεται να αδειάσεις και τη βρύση.',
    ],
    night: [
      'Είναι αργά. Ένα μικρό ποτήρι αν διψάς, και ύπνο.',
      'Ώρα για ύπνο. Τους λογαριασμούς τους κάνουμε αύριο.',
      'Νύχτα. Ούτε εγώ θα σου στείλω υπενθύμιση τώρα.',
      'Ό,τι ήπιες, ήπιες. Το αύριο ξεκινάει από το μηδέν και από ένα ποτήρι.',
    ],
    hot: [
      'Σήμερα έχει {temp}°. Ο ιδρώτας φεύγει, το νερό πρέπει να έρθει.',
      'Με {temp}° έξω, το νερό είναι ο κλιματισμός σου από μέσα.',
      'Ζέστη. Κράτα το μπουκάλι κοντά σου, αλλά όχι στον ήλιο.',
      'Καύσωνας σήμερα, γι\' αυτό ο στόχος ανέβηκε λίγο. Δεν είναι προσωπικό.',
    ],
    cold: [
      'Στο κρύο δεν διψάς τόσο, αλλά το νερό το χρειάζεσαι σχεδόν το ίδιο.',
      'Κρύο έξω. Ένα ζεστό τσάι μετράει κι αυτό στο νερό της ημέρας.',
      'Με {temp}° κανείς δεν σκέφτεται το νερό. Γι\' αυτό είμαι εδώ.',
    ],
    rain: [
      'Βρέχει έξω, αλλά δυστυχώς αυτό δεν μετράει στον στόχο σου.',
      'Μέρα για σπίτι και τσάι. Το τσάι μετράει.',
      'Ο ουρανός πίνει για όλους σήμερα. Εσύ πιες για σένα.',
    ],
    monday: ['Δευτέρα. Ξεκίνα την εβδομάδα με κάτι που σίγουρα θα πετύχει: ένα ποτήρι νερό.'],
    weekend: [
      'Σαββατοκύριακο. Το πρόγραμμα αλλάζει, η ανάγκη για νερό όχι.',
      'Ρεπό από τη δουλειά, όχι από το νερό.',
    ],
  },
  en: {
    morning: [
      'Good morning. One glass now and the day starts with a lead.',
      'You slept for hours without water. Fair enough that I\'m waiting.',
      'Water before coffee. Coffee won\'t take it personally.',
      'The first glass of the day is the easiest. It counts just as much.',
      'Good morning. Your bottle is right where you left it yesterday.',
      'The day is still empty. So is the glass.',
      'Start with water. Everything else can wait a minute.',
      'Today\'s goal is {goal}. The first glass is my favourite.',
      'Your eyes are awake. Let\'s wake up the rest of you.',
      'Good morning. I\'m not asking for much, just 250 ml to begin.',
    ],
    behind: [
      'We\'re a little behind. Nothing a glass can\'t fix.',
      '{left} to go. Sounds like a lot, but it\'s only a few glasses.',
      'If you\'re already thirsty, you\'re a bit late. If not, even better: drink now.',
      'The clock is moving faster than your glass.',
      'I\'m looking for water and finding only good intentions.',
      'I\'m not blaming you. I\'m just looking at you. Holding an empty glass.',
      'One glass now, one with your next meal, and we\'re back on track.',
      'That afternoon slump is sometimes just thirst.',
      'Your bottle is waving at you from across the desk.',
      'Behind schedule, but not out of the race.',
      'A little water now is easier than a lot of water tonight.',
      'You forgot about me a bit today. That\'s fine, I didn\'t forget you.',
    ],
    evening: [
      '{left} to go. Split it into small glasses, not one big heroic effort.',
      'Evening is no time for records. A glass or two, and earlier tomorrow.',
      'Don\'t drink it all now. Your sleep will thank you.',
      'Long day, it seems. One glass and we call it a fair finish.',
      'Whatever doesn\'t happen today, we start again tomorrow morning. One glass now, though.',
      'The day is ending, the ring isn\'t full yet. A little more?',
    ],
    onTrack: [
      'Right on schedule. That\'s rare, enjoy it.',
      'Nice pace. Keep this up and you won\'t hear from me today.',
      'You\'re doing well. Not my opinion, the numbers say so.',
      '{total} so far. Steady and without fuss.',
      'That\'s called consistency. Boring name, excellent results.',
      'I don\'t want anything. Just came to say you\'re doing well.',
      'A glass every so often is the whole secret. You\'ve got it.',
      'Not ahead, not behind. Exactly where you should be.',
      '{left} to go. At this pace you\'ll be done before evening.',
      'Your body gets what it needs before it has to ask. Well done.',
    ],
    ahead: [
      'You\'re ahead of schedule. Don\'t tell the clock.',
      'This early and already {total}? You\'re making me feel unnecessary.',
      'A lead. Now you can relax a little. A little.',
      'You\'re faster than I expected. Nice surprise.',
      'At this rate I won\'t need to remind you of anything today.',
      'If only everything went as well as your water today…',
    ],
    almost: [
      'Only {left} left. One glass, maybe two.',
      'I can see the finish line.',
      'So close it would be a shame to stop here.',
      'Another {left} and today turns blue on the calendar.',
      'Final stretch. No rush, just don\'t stop.',
      'Almost. And "almost" needs just one glass to become "done".',
    ],
    done: [
      'Goal reached. From here on, drink when you\'re thirsty, no help needed.',
      'You did it. Today goes on the calendar in blue.',
      'No more reminders today. You earned it.',
      'Mission accomplished. Glou retires, satisfied.',
      'You did something good for yourself today, almost without noticing.',
      'The ring is full. So am I, with pride.',
      'Goal reached. Same again tomorrow, and it becomes a habit.',
    ],
    streak: [
      '{streak} days in a row. That\'s not luck any more, it\'s a habit.',
      'A {streak}-day streak. Don\'t break it over one glass.',
      '{streak} days. If this were a gym, they\'d greet you by name.',
    ],
    overflow: [
      'You passed your goal by a mile. From here on, drink only when you\'re thirsty.',
      'More isn\'t always better. You\'re doing great today.',
      'Impressive. But you don\'t need to empty the tap as well.',
    ],
    night: [
      'It\'s late. A small glass if you\'re thirsty, then sleep.',
      'Time for bed. We\'ll do the maths tomorrow.',
      'Night time. Even I won\'t send you a reminder now.',
      'What you drank, you drank. Tomorrow starts from zero and one glass.',
    ],
    hot: [
      'It\'s {temp}° today. Sweat goes out, water has to come in.',
      'With {temp}° outside, water is your air conditioning from the inside.',
      'Hot one. Keep your bottle close, just not in the sun.',
      'Heatwave today, so the goal went up a bit. Nothing personal.',
    ],
    cold: [
      'In the cold you feel less thirsty, but you need water almost as much.',
      'Cold outside. A hot tea counts towards today\'s water too.',
      'At {temp}° nobody thinks about water. That\'s why I\'m here.',
    ],
    rain: [
      'It\'s raining outside, but sadly that doesn\'t count towards your goal.',
      'A day for home and tea. Tea counts.',
      'The sky is drinking for everyone today. You drink for you.',
    ],
    monday: ['Monday. Start the week with something that\'s sure to work: a glass of water.'],
    weekend: ['Weekend. The schedule changes, the need for water doesn\'t.', 'A day off work, not off water.'],
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
    if (weekday === 0 || weekday === 6) options.push(...lines.weekend)
    if (streak >= 3) options.push(lines.streak[0])
  }
  return { category, options }
}

export function fill(text, values) {
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match))
}

export function glouLine(language, context, values) {
  const { category, options } = lineOptions(language, context)
  const seed = `${dayKey(context.now)}|${context.now.getHours()}|${context.total}|${category}`
  return fill(options[tipIndex(seed, options.length)], { ...values, streak: context.streak, temp: context.weather?.max })
}

export function allLines() {
  return LINES
}
