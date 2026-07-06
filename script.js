{
  /* <script
type="text/x-dc "
data-dc-script=" "
data-props='{   "$preview": { "width": 430, "height": 920 },   "autoAdvance": { "editor": "boolean", "default": true, "tsType": "boolean", "section": "Behavior" },   "advanceDelay": { "editor": "range", "default": 300, "min": 0, "max": 800, "step": 50, "unit": "ms", "tsType": "number", "section": "Behavior" } } '
> */
}
class Component extends DCLogic {
  state = {
    screen: "intro",
    chosen: {},
    arch: null,
    routing: false,
    firstName: "",
    email: "",
    phone: "",
    sms: false,
    touched: false,
  };
  order = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];
  questions = [
    {
      id: "q1",
      text: "When you look in the mirror, what do you want to fix?",
      cards: [
        { label: "The color. Staining or yellowing I cannot brush away." },
        { label: "The shape. Chips, worn-down, or uneven edges." },
        { label: "The gaps or crowding. Teeth that are spaced or crooked." },
        { label: "All of it. I just want a fresh, natural-looking smile." },
        { label: "I am mostly happy, I just want it brighter and more even." },
      ],
    },
    {
      id: "q2",
      text: "What is your age range?",
      cards: [
        { label: "Under 18", dq: "A" },
        { label: "18 to 24" },
        { label: "25 to 34" },
        { label: "35 to 44" },
        { label: "45 to 54" },
        { label: "55 to 64" },
        { label: "65 or older" },
      ],
    },
    {
      id: "q3",
      text: "What brings you to Revive today?",
      cards: [
        {
          label: "I want a complete smile makeover, without the dental chair.",
        },
        { label: "I want to hide stains, chips, gaps, or worn-down edges." },
        { label: "I have a big event coming up and want to look my best." },
        {
          label:
            "I have active dental pain, infection, or a tooth that needs work.",
          dq: "B",
        },
      ],
    },
    {
      id: "q4",
      text: "How are your gums and teeth right now?",
      cards: [
        { label: "Healthy. All or most of my teeth are there." },
        { label: "Mostly healthy. A few minor things, but no pain." },
        {
          label: "I have sore or bleeding gums, loose teeth, or heavy decay.",
          dq: "B",
        },
        { label: "I wear full dentures on the arch I want to cover.", dq: "C" },
      ],
    },
    {
      id: "q5",
      text: "Which arch are you looking to design?",
      cards: [
        { label: "Both my top and bottom teeth", arch: "both" },
        { label: "Just my top teeth", arch: "upper" },
        { label: "Just my bottom teeth", arch: "lower" },
      ],
    },
    {
      id: "q6",
      text: "On that arch, how many of your own teeth do you have?",
      cards: [
        { label: "All or almost all of them." },
        {
          label:
            "I am missing a few, but I have at least 5 healthy teeth on that arch.",
        },
        {
          label: "I am missing most of them, fewer than 5 left on that arch.",
          dq: "C",
        },
      ],
    },
    {
      id: "q7",
      text: "When would you like your new smile ready?",
      cards: [
        { label: "As soon as possible. I am ready now." },
        { label: "I have a specific event coming up." },
        { label: "No rush, I am just exploring." },
      ],
    },
  ];
  dq = {
    A: {
      headline: "Thanks for stopping by.",
      body: "Revive is designed for adults 18 and older, so we are not able to set you up with a custom set right now. If you are interested down the road, we will be here. In the meantime, your own dentist is the best person to talk to about your smile.",
    },
    B: {
      headline: "Let's get your dental health sorted first. ",
      body: "From your answers, it sounds like something may need a dentist's attention before a cosmetic product would be right. Revive sits over a healthy, settled mouth, so the best first step is to see your own dentist and get any pain or infection taken care of. Once things are healthy and stable, come back any time. We would be glad to help you then. ",
    },
    C: {
      headline: "Revive may not be the right fit for your smile.",
      body: "Revive snaps over your own natural teeth, so it needs a certain number of healthy teeth on the arch to hold onto securely. From your answers, there may not be enough natural teeth remaining on that arch for it to fit the way it should. We would rather be honest with you now than send you something that will not work. Your own dentist can walk you through the options that suit your situation best.",
    },
  };
  start = () => this.go("q1");
  go = (s) => this.setState({ screen: s, routing: false, touched: false });
  pick = (qid, i, card) => {
    if (this.state.routing) return;
    const chosen = { ...this.state.chosen, [qid]: i };
    const arch = card.arch || this.state.arch;
    if (this.props.autoAdvance ?? true) {
      this.setState({ chosen, arch, routing: true });
      setTimeout(() => this.route(qid), this.props.advanceDelay ?? 300);
    } else {
      this.setState({ chosen, arch });
    }
  };
  route = (qid) => {
    const i = this.state.chosen[qid];
    if (i == null) return;
    const q = this.questions.find((x) => x.id === qid);
    const card = q.cards[i];
    const dest = card.dq ? "dq" + card.dq : this.nextOf(qid);
    this.go(dest);
  };
  nextOf = (qid) => {
    const idx = this.order.indexOf(qid);
    return idx < this.order.length - 1 ? this.order[idx + 1] : "lead";
  };
  field = (k) => (e) => this.setState({ [k]: e.target.value });
  toggleSms = () => this.setState((s) => ({ sms: !s.sms }));
  validEmail = (v) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test((v || "").trim());
  submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const okName = this.state.firstName.trim().length > 0;
    const okEmail = this.validEmail(this.state.email);
    if (okName && okEmail) this.go("result");
    else this.setState({ touched: true });
  };
  renderVals() {
    const s = this.state;
    const screen = s.screen;
    const isQuestion = this.order.includes(screen);
    const isDQ = screen.indexOf("dq") === 0;
    const auto = this.props.autoAdvance ?? true;
    const baseCard =
      "display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:18px;border-radius:14px;font-family:inherit;font-size:16.5px;font-weight:500;line-height:1.35;cursor:pointer;transition:border-color .18s,background .18s,box-shadow .18s; ";
    const unselected =
      baseCard +
      "background:#FCFCFC;border:1.5px solid #E4E5EA;color:#1A1A1A;box-shadow:0 1px 2px rgba(20,22,30,0.05); ";
    const selected =
      baseCard +
      "background:#E7F3EE;border:1.5px solid #0F7A57;color:#1A1A1A;box-shadow:0 6px 16px rgba(15,122,87,0.14); ";
    let qText = "",
      qCards = [],
      progressPct = 0;
    if (isQuestion) {
      const q = this.questions.find((x) => x.id === screen);
      qText = q.text;
      qCards = q.cards.map((c, i) => {
        const isSel = s.chosen[screen] === i;
        return {
          label: c.label,
          isSelected: isSel,
          cardStyle: isSel ? selected : unselected,
          onClick: () => this.pick(screen, i, c),
        };
      });
      progressPct = Math.round(
        ((this.order.indexOf(screen) + 1) / this.order.length) * 100,
      );
    }
    let dqEyebrow = "",
      dqHeadline = "",
      dqBody = "",
      dqSignature = "";
    if (isDQ) {
      const d = this.dq[screen.slice(2)] || {};
      dqEyebrow = d.eyebrow || "";
      dqHeadline = d.headline || "";
      dqBody = d.body || "";
      dqSignature = d.signature || "";
    }
    const name = (s.firstName || "").trim();
    const resultHeadline =
      "Good news, " + (name || "there") + ". You are a strong fit for Revive.";
    const claimHref =
      "/pages/revive-veneers?discount=QUIZ100&arch=" + (s.arch || "both");
    return {
      isIntro: screen === "intro",
      isQuestion,
      isLead: screen === "lead",
      isResult: screen === "result",
      isDQ,
      showProgress: isQuestion,
      progressWidth: progressPct + "%",
      onStart: this.start,
      qText,
      qCards,
      showContinue: !auto && isQuestion && s.chosen[screen] != null,
      onContinue: () => this.route(screen),
      firstName: s.firstName,
      email: s.email,
      phone: s.phone,
      sms: s.sms,
      smsConsent: s.sms && (s.phone || "").trim().length > 0 ? "true" : "false",
      onFirstName: this.field("firstName"),
      onEmail: this.field("email"),
      onPhone: this.field("phone"),
      onToggleSms: this.toggleSms,
      onSubmit: this.submit,
      nameError: s.touched && !s.firstName.trim(),
      emailError: s.touched && !this.validEmail(s.email),
      resultHeadline,
      claimHref,
      dqEyebrow,
      hasEyebrow: !!dqEyebrow,
      dqHeadline,
      dqBody,
      dqSignature,
      hasSignature: !!dqSignature,
    };
  }
}
// </script>
