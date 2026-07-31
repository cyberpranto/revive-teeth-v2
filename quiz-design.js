
class Component extends DCLogic {
    state = { screen: 'q1', chosen: {}, arch: null, smileGoal: null, routing: false, firstName: '', email: '', touched: false, submitting: false };
    steps = ['q1', 'q2', 'q3', 'disclaimer', 'lead'];
    questionIds = ['q1', 'q2', 'q3'];
    questions = [{ id: 'q1', text: 'What would you change about your smile?', cards: [{ label: 'The color', goal: 'color' }, { label: 'The shape', goal: 'shape' }, { label: 'The gaps', goal: 'gaps' }, { label: 'All of it', goal: 'all' }, { label: "I'm mostly happy", goal: 'mostly_happy' },] }, { id: 'q2', text: 'Which teeth are we designing?', cards: [{ label: 'My top teeth', arch: 'upper' }, { label: 'My bottom teeth', arch: 'lower' }, { label: 'Both', arch: 'both' },] }, { id: 'q3', text: 'How many natural teeth do you have?', cards: [{ label: 'All or almost all' }, { label: 'A few missing' }, { label: 'Most of them missing', dq: 'C' }, { label: 'I have tooth pain or a tooth that needs work', dq: 'B' },] },]; dq = { B: { headline: "Let's get your dental health sorted first.", body: "From your answers, it sounds like something may need a dentist's attention before a cosmetic product would be right. Revive sits over a healthy, settled mouth, so the best first step is to see your own dentist and get any pain or infection taken care of. Once things are healthy and stable, come back any time. We would be glad to help you then." }, C: { headline: 'Revive may not be right for your smile.', body: 'Revive snaps over your own natural teeth, so it needs a certain number of healthy teeth to hold onto securely. From your answers, there may not be enough natural teeth remaining there for Revive to be right for you. We would rather be honest with you now than send you something that will not work. Your own dentist can walk you through the options that suit your situation best.' }, };
    go = (s) => this.setState({ screen: s, routing: false, touched: false });
    pick = (qid, i, card) => { if (this.state.routing) return; const next = { chosen: { ...this.state.chosen, [qid]: i } }; if (card.arch) next.arch = card.arch; if (card.goal) next.smileGoal = card.goal; if (this.props.autoAdvance ?? true) { next.routing = true; this.setState(next); setTimeout(() => this.route(qid), this.props.advanceDelay ?? 300); } else { this.setState(next); } }; route = (qid) => { const i = this.state.chosen[qid]; if (i == null) return; const q = this.questions.find((x) => x.id === qid); const card = q.cards[i]; this.go(card.dq ? ('dq' + card.dq) : this.nextOf(qid)); }; nextOf = (id) => {
        const idx = this.steps.indexOf(id);
        return idx < this.steps.length - 1 ? this.steps[idx + 1] : 'lead';
    };
    field = (k) => (e) => this.setState({ [k]: e.target.value });
    validEmail = (v) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test((v || '').trim());
    offerHref = () => '/pages/offer?arch=' + (this.state.arch || 'both');
    submit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const s = this.state;
        if (s.submitting) return;
        if (!s.firstName.trim() || !this.validEmail(s.email)) {
            this.setState({ touched: true });
            return;
        }
        this.setState({ submitting: true });
        const lead = { first_name: s.firstName.trim(), email: s.email.trim(), email_consent: true, email_consent_at: new Date().toISOString(), smile_goal: s.smileGoal, arch: s.arch || 'both', };
        try {
            window.dispatchEvent(new CustomEvent('revive:quiz-lead', { detail: lead }));
            if (typeof window.reviveSubmitLead === 'function') window.reviveSubmitLead(lead);
        }
        catch (err) {
            /* submission handled by host */
        }
        // Let the submitting state paint before navigating away. 
        if (this.props.liveRedirect ?? true) {
            const href = this.offerHref();
            requestAnimationFrame(() => setTimeout(() => window.location.assign(href), 0));
        }
    };
    chosenCard = (qid) => {
        const i = this.state.chosen[qid];
        if (i == null) return null;
        const q = this.questions.find((x) => x.id === qid);
        return q ? q.cards[i] : null;
    };
    renderVals() {
        const s = this.state;
        const screen = s.screen;
        const isQuestion = this.questionIds.includes(screen);
        const isDQ = screen.indexOf('dq') === 0;
        const auto = this.props.autoAdvance ?? true;
        const baseCard = "display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:18px;border-radius:14px;font-family:inherit;font-size:16.5px;font-weight:500;line-height:1.35;cursor:pointer;transition:border-color .18s,background .18s,box-shadow .18s;";


        const unselected = baseCard + "background:#FCFCFC;border:1.5px solid #E4E5EA;color:#1A1A1A;box-shadow:0 1px 2px rgba(20,22,30,0.05);";
        const selected = baseCard + "background:#E7F3EE;border:1.5px solid #0F7A57;color:#1A1A1A;box-shadow:0 6px 16px rgba(15,122,87,0.14);";
        const archNow = (this.chosenCard('q2') || {}).arch || s.arch || 'both';
        const q3Text = archNow === 'upper' ? 'How many natural teeth do you have on top?' : archNow === 'lower' ? 'How many natural teeth do you have on the bottom?' : 'How many natural teeth do you have?';
        let qText = '', qCards = []; if (isQuestion) {
            const q = this.questions.find((x) => x.id === screen); qText = screen === 'q3' ? q3Text : q.text;
            qCards = q.cards.map((c, i) => {
                const isSel = s.chosen[screen] === i;
                return { label: c.label, isSelected: isSel, cardStyle: isSel ? selected : unselected, onClick: () => this.pick(screen, i, c) };
            });
        }
        const stepIdx = this.steps.indexOf(screen);
        const progressPct = stepIdx >= 0 ? Math.round(((stepIdx + 1) / this.steps.length) * 100) : 0;
        const d = isDQ ? (this.dq[screen.slice(2)] || {}) : {};
        // Header set name, arch and credit all derive from the single stored Q2 answer so they cannot diverge.  
        const c2 = this.chosenCard('q2');
        const arch = (c2 && c2.arch) || s.arch || 'both';
        const teethPhrase = arch === 'upper' ? 'top teeth' : arch === 'lower' ? 'bottom teeth' : 'top and bottom teeth'; const credit = arch === 'both' ? '$300' : '$200'; return { screen, isQuestion, isDisclaimer: screen === 'disclaimer', isLead: screen === 'lead', isDQ, showProgress: stepIdx >= 0, progressWidth: progressPct + '%', qText, qCards, showContinue: !auto && isQuestion && (s.chosen[screen] != null), onContinue: () => this.route(screen), onAcknowledge: () => this.go('lead'), ctaLabel: s.submitting ? 'Taking you to your set\\u2026' : 'Take me to my set', submitting: s.submitting, ctaName: 'Take me to my set', ctaStyle: 'display:flex; align-items:center; justify-content:center; gap:10px; width:100%; margin-top:18px; padding:18px 18px; border:none; border-radius:12px; background:#0F7A57; color:#FFFFFF; font-family:inherit; font-size:16px; font-weight:600; letter-spacing:-0.01em; box-shadow:0 8px 22px rgba(15,122,87,0.24); white-space:nowrap; ' + (s.submitting ? 'opacity:0.6; cursor:default;' : 'opacity:1; cursor:pointer;'), previewRows: [{ pre: "The set we'd design for your " + teethPhrase, em: '', post: '' }, { pre: 'Your price, with your ', em: credit + ' credit', post: ' already applied' }, { pre: 'Real customers on camera, wearing theirs', em: '', post: '' }, { pre: 'Why a cosmetic dentist built Revive', em: '', post: '' },], firstName: s.firstName, email: s.email, smileGoal: s.smileGoal || '', archValue: arch, onFirstName: this.field('firstName'), onEmail: this.field('email'), onSubmit: this.submit, nameError: s.touched && !s.firstName.trim(), emailError: s.touched && !this.validEmail(s.email), dqHeadline: d.headline || '', dqBody: d.body || '', showFindDentist: screen === 'dqB', };
    }
}
