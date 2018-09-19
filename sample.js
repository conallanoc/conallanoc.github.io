function vm() {
  var self = this;
  self.textField = ko.observable("Type here!");
}

ko.applyBindings(new vm());
