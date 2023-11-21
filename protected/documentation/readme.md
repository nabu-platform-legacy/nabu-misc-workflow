# Indexes

create index idx_workflow_properties_workflow_id on workflow_instance_properties(workflow_id);
create index idx_workflow_transition_instances_workflow_id on workflow_transition_instances(workflow_id);
create index idx_workflow_transition_instances_actor_id on workflow_transition_instances(actor_id);



Optioneel: 

create index idx_workflow_instance_properties_key on workflow_instance_properties(key);
create index idx_workflow_instances_context_id on workflow_instances(context_id);