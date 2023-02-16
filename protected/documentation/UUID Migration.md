Oudere workflows gaan bij extension states mogelijk de naam nog hebben staan ipv de id. Dus state A extends state B door letterlijk te zeggen "B" ipv de achterliggende id van B.
Deze referenties moeten geupdate worden naar de uuid.

Oudere workflows gebruiken als state ids (en transitie ids) soms nog "-" based UUID syntax. Voor de XML definitie maakt dit niet zo uit, maar op het filesysteem wel.
In de private folder staan (onder state bv.) folders met de uuid naam erin. Als hier nog folders zijn met "-" based naming moeten die geupdate worden om geen dashes te bevatten.

alter table workflow_batch_instances alter column id set data type uuid using id::uuid;
alter table workflow_batch_instances alter column workflow_id set data type uuid using workflow_id::uuid;
alter table workflow_batch_instances alter column transition_id set data type uuid using transition_id::uuid;

alter table workflow_instance_properties alter column id set data type uuid using id::uuid;
alter table workflow_instance_properties alter column workflow_id set data type uuid using workflow_id::uuid;
alter table workflow_instance_properties alter column transition_id set data type uuid using transition_id::uuid;

alter table workflow_transition_instances alter column id set data type uuid using id::uuid;
alter table workflow_transition_instances alter column workflow_id set data type uuid using workflow_id::uuid;
alter table workflow_transition_instances alter column definition_id set data type uuid using definition_id::uuid;
alter table workflow_transition_instances alter column parent_id set data type uuid using parent_id::uuid;
alter table workflow_transition_instances alter column batch_id set data type uuid using batch_id::uuid;

alter table workflow_transition_instances alter column from_state_id set data type uuid using from_state_id::uuid;
alter table workflow_transition_instances alter column to_state_id set data type uuid using to_state_id::uuid;


alter table workflow_instances alter column id set data type uuid using id::uuid;
alter table workflow_instances alter column parent_id set data type uuid using parent_id::uuid;
alter table workflow_instances alter column batch_id set data type uuid using batch_id::uuid;

alter table workflow_instances alter column state_id set data type uuid using state_id::uuid;
