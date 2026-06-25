import BackButton from '@components/grid/button/back';
import BackFormButton from '@components/grid/button/back-form';
import { UpdateAction, UpdateButton, UpdateActionIcon } from '@components/grid/button/update';

import { RowReorderButton } from './row-reorder';
import { CreateAction, CreateButton } from './create';
import { ViewAction, ViewButton, ViewActionIcon } from './view';
import { DeleteAction, DeleteButton, DeleteActionIcon } from './delete';

export const Button = {
    Create: CreateButton,
    View: ViewButton,
    Update: UpdateButton,
    Delete: DeleteButton,
    RowReorder: RowReorderButton,
    Back: BackButton,
    BackForm: BackFormButton,
};

export const Action = {
    Create: CreateAction,
    View: ViewAction,
    Update: UpdateAction,
    Delete: DeleteAction,
};

export const ActionIcon = {
    Update: UpdateActionIcon,
    View: ViewActionIcon,
    Delete: DeleteActionIcon,
};
