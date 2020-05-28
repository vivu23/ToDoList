function showError() {
  const input = $("#input").val();

  if(input.trim().length === 0){
    $("#input").css("border-color", "red");
    $("#submitButton").attr('disabled', 'disabled');
  }

  else{
    $("#input").css("border-color", "green");
    $("#submitButton").removeAttr('disabled');
  }
}
