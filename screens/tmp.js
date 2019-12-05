<Form>
<View style={styles.formAlign}>
  <Item style={styles.inputItem}>
    {!this.state.fullnameswitch ? (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          this.setState({fullName: '', fullnameswitch: true})
          console.log(this.state)
        }}
      >
        <Text style={{color: 'white'}}>Edit Name</Text>
      </TouchableOpacity>
    ) : (
      <Input
        placeholder={`Full Name: (Previously: ${this.props.navigation.state.params.user.fullName})`}
        name="fullName"
        style={styles.input}
        onChangeText={fullName => {
          this.setState({fullName})
        }}
        value={this.state.fullName}
      />
    )}
  </Item>
  <Item style={styles.inputItem}>
    {!this.state.distPrefswitch ? (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          this.setState({distPref: '', distPrefswitch: true})
          console.log(this.state)
        }}
      >
        <Text style={{color: 'white'}}>
          Edit Distance Prefered
        </Text>
      </TouchableOpacity>
    ) : (
      <Input
        placeholder={`Distance Prefered: (Previously: ${this.props.navigation.state.params.user.distPref})`}
        style={styles.input}
        onChangeText={distPref => {
          this.setState({distPref})
        }}
        value={this.state.distPref}
        name="distPref"
      />
    )}
  </Item>
  <Item style={styles.inputItem}>
    {!this.state.emailswitch ? (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          this.setState({email: '', emailswitch: true})
          console.log(this.state)
        }}
      >
        <Text style={{color: 'white'}}>Edit Email</Text>
      </TouchableOpacity>
    ) : (
      <Input
        placeholder={`Email: (Previously: ${this.props.navigation.state.params.user.email})`}
        name="email"
        style={styles.input}
        onChangeText={email => {
          this.setState({email})
        }}
        value={this.state.email}
      />
    )}
  </Item>
  <Item style={styles.inputItem}>
    {!this.state.iAmswitch ? (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          this.setState({iAm: '', iAmswitch: true})
          console.log(this.state)
        }}
      >
        <Text style={{color: 'white'}}>Edit Gender</Text>
      </TouchableOpacity>
    ) : (
      <Input
        placeholder={`I Identify As: (Previously: ${this.props.navigation.state.params.user.iAm})`}
        style={styles.input}
        onChangeText={iAm => {
          this.setState({iAm})
        }}
        value={this.state.iAm}
        name="iAm"
      />
    )}
  </Item>
</View>
</Form>
<View style={{justifyContent: 'center'}}>
<TouchableOpacity
  style={styles.buttonContainer}
  onPress={this.submitHandler}
>
  <Text style={{color: 'white'}}>Save</Text>
</TouchableOpacity>
</View>
