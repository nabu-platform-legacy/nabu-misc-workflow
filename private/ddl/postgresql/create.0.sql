create table workflow_batch_instances (
	id text primary key,
	workflow_id text,
	transition_id text,
	system_id text,
	started timestamp,
	created timestamp,
	stopped timestamp,
	state text
);
create table workflow_instances (
	id text primary key,
	definition_id text not null,
	parent_id text,
	batch_id text,
	context_id text,
	group_id text,
	workflow_type text,
	correlation_id text,
	uri text,
	started timestamp not null,
	stopped timestamp,
	environment text not null,
	transition_state text not null,
	state_id text not null
);
create table workflow_instance_properties (
	key text,
	value text,
	id text primary key,
	workflow_id text not null,
	transition_id text not null
);
create table workflow_transition_instances (
	id text primary key,
	definition_id text not null,
	workflow_id text not null,
	parent_id text,
	actor_id text,
	system_id text not null,
	started timestamp not null,
	stopped timestamp,
	uri text,
	log text,
	code text,
	error_log text,
	error_code text,
	sequence integer not null,
	transition_state text,
	from_state_id text,
	to_state_id text,
	batch_id text
);

