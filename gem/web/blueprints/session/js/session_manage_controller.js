function extendSessionController(me) {
    me.nextStageLabel = $("#state-next")

    me.onChangeStageResponse = function(data) {
        if (data.next.title != data.current.title) {
            var title = data.next.title ? " &laquo;" + data.next.title + "&raquo;" : ""
            me.nextStageLabel.html(title)
        } else {
            var type = data.next.type ? " (" + data.next.type + ")" : ""
            me.nextStageLabel.html(type)
        }
    }

    me.onCloseSessionResponse = function(data) {
        //console.log(data)
    }


    // Actions ---------------------------------------------------------------------------------------------------------

    me.changeStage = function(value) {
        me.socket.emit("change_stage", { value: value }, me.onChangeStageResponse)
    }

    me.closeSession = function() {
        me.socket.emit("close", me.onCloseSessionResponse)
    }

    me.setCountdownTimer = function(minutes) {
        me.socket.emit("timer", { interval: minutes })
    }

    return me
}

$(document).ready(function() {
    extendSessionController(controller)

    $(".change-stage").on("click", function(e) {
        e.preventDefault()
        var value = $(this).data("value")
        controller.changeStage(value)
    })

    $(".run-close").on("click", function(e) {
        e.preventDefault()
        controller.closeSession()
    })

    $("#stage").on("click", ".run-close", function(e) {
        e.preventDefault()
        controller.closeSession()
    })

    $(".timer-set").on("click", function(e) {
        e.preventDefault()
        var minutes = $(this).data("value")
        controller.setCountdownTimer(minutes)
    })
})