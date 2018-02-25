//Radio selection for new project tag
$('.radio-group .radio').click(function () {
    $(this).parent().find('.radio').removeClass('selected');
    $(this).addClass('selected');
    var val = $(this).attr('data-value');
    $(this).parent().find('input').val(val);
});