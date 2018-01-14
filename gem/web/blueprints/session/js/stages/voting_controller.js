/* Voting Stage Controller
 *
 * param session: session
 */
function VotingStageController(session) {

    function setState(value) {
        state = value
    }

    function register() {
        $("#vote-private").on("change", onSecretBallotCheckboxChanged)
        $(".vote").on("click", onVoteButtonClicked)
        session.timer.on(onTimerTick)
    }

    function unregister() {
        session.timer.off(onTimerTick)
    }

    function view() {
        var permissions = session.user.permissions
        
        return Object.assign(state, {
            voteStatus: voteStatus, timeIsOver,
            quorum: state.quorum,
            isFinalVote: state.type == "final",
            isVoteSubmitted: voteStatus.success == true,
            isVoteNotAccepted: voteStatus.success == false,
            isVoteChanged: voteStatus.prev && voteStatus.prev != voteStatus.value,
            vote: voteViewName(voteStatus.value),
            prevVote: voteViewName(voteStatus.prev),
            canVote: !timeIsOver && permissions.indexOf("vote") != -1,
            canManage: permissions.indexOf("vote.manage") != -1,
            privateChecked: state.private ? "checked" : "",
            showPrivateAlert: state.private && permissions.indexOf("vote") != -1,
            noQuorum: state.can_vote < state.quorum
        })
    }

    // Private members

    var state = null
    var voteStatus = {success:undefined, prev:undefined, value:undefined} // user's vote status
    var timeIsOver = false

    // handlers

    function onSecretBallotCheckboxChanged(e) {
        var val = $(this).is(":checked") // is checked?
        setVotingPrivacy(val)
    }

    function onVoteButtonClicked(e) {
        e.preventDefault()
        var value = $(this).data("vote")
        vote(value)
    }

    function onVoteResponse(response) {
        voteStatus = response
        session.stage.render()
    }

    function onTimerTick(value) {
        if (value <= 0 && !timeIsOver) {
            timeIsOver = true
            session.stage.render()
        } else if (value > 0 && timeIsOver) {
            timeIsOver = false
            session.stage.render()
        }
    }

    // Actions

    function vote(value) {
        session.emit("vote", {value: value}, onVoteResponse)
    }

    function setVotingPrivacy(value) {
        session.emit("manage", {private: value})
    }

    function voteViewName(value) {
        if (value == "yes") return "In Favor"
        if (value == "no") return "Against"
        if (value == "undecided") return "Abstention"
        return value
    }

    return { register, unregister, view, setState }
}