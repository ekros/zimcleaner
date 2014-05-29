/*
 * Copyright [2014] [Eric Ros] ericrosbh@gmail.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

function initLocales(locale_config)
{
    if (locale_config.indexOf("en") > -1) // english
    {
        HEAVIEST_WARNING = "Your heavy messages take up too much space";
        SHOW_BUTTON = "Show";
        CLEAN_BUTTON = "Clean";
        EXPORT_AND_TAG_BUTTON = "Export and tag";
        HEAVIEST_EXPORT_AND_TAG_TOOLTIP = "Download the 20th heaviest messages and tag them. After the download finishes you can safely delete the tagged messages.";
        OLDEST_WARNING = "Your old messages take up too much space";
        OLDEST_EXPORT_AND_TAG_TOOLTIP = "Download the 1000th oldest messages and tag them. After the download finishes you can safely delete the tagged messages";
        UNREAD_WARNING = "You have too many unread messages";
        UNREAD_ADVICE = "Solution: Check unread messages<br>You can use filters in order to automatically deal with incoming messages. See Preferences > Filters";
        CRITICAL_WARNING = "Your mailbox quota is almost full.";
        CLICK_ON_TAB = "Click on Zimcleaner tab to know more.";
        TAG_NOTIFICATION = "Items successfully tagged. Preparing download...";
        SUGGESTIONS_TITLE = "Suggestions";
        TRASH_WARNING = "Your trash takes up too much space";
        SHOW_MESSAGES_BUTTON = "Show (messages)";
        SHOW_BRIEFCASE_BUTTON = "Show (briefcase)";
        SPAM_WARNING = "Your spam takes up too much space";
        DRAFT_WARNING = "Your drafts take up too much space";
        BRIEFCASE_WARNING = "Your briefcase takes up too much space";
        USER_QUOTA_TITLE = "User quota";
        OF = "of";
        SPACE_USAGE = "space usage";
        USED_SPACE_DETAILS = "Used space details";
        CLIC_TO_SEE_MORE_LABEL = "Click on an element to see more details";
        INBOX = "Inbox";
        TRASH = "Trash";
        DRAFTS = "Drafts";
        SENT = "Sent";
        SPAM = "Spam";
        BRIEFCASE = "Briefcase";
        OTHER = "Other";
        RELOAD_BUTTON = "Analyse again";
        DONATE_INFO = "Did you find this software useful?";
        // dialogs
        CLEAN_TRASH_CONFIRM = "This will remove all the trash contents, including emails, contacts, appointments and briefcase documents. Are you sure to continue?";
        CLEAN_SPAM_CONFIRM = "This will remove the spam folder contents. Are you sure to continue?";
        CLEAN_DRAFTS_CONFIRM = "This will remove the drafts folder contents. Are you sure to continue?";
        // tags
        HEAVIEST_MESSAGES_TAG = "heaviest-messages-";
        OLDEST_MESSAGES_TAG = "oldest-messages-";
        // button titles
        SHOW_HEAVIEST_TITLE = "Show messages ordered by size";
        SHOW_OLDEST_TITLE = "Show old messages, ordered by date";
    }
    else if (locale_config.indexOf("es") > -1) // es-ES
    {
        HEAVIEST_WARNING = "Los mensajes pesados ocupan demasiado espacio";
        SHOW_BUTTON = "Mostrar";
        CLEAN_BUTTON = "Limpiar";
        EXPORT_AND_TAG_BUTTON = "Exportar y etiquetar";
        HEAVIEST_EXPORT_AND_TAG_TOOLTIP = "Descarga los 20 mensajes más pesados y los etiqueta. Al finalizar la descarga puede borrar los mensajes etiquetados con seguridad.";
        OLDEST_WARNING = "Los mensajes viejos ocupan demasiado espacio";
        OLDEST_EXPORT_AND_TAG_TOOLTIP = "Descarga los 1000 mensajes más antiguos y los etiqueta. Al finalizar la descarga puede borrar los mensajes etiquetados con seguridad.";
        UNREAD_WARNING = "Tiene demasiados mensajes no leídos";
        UNREAD_ADVICE = "Solución: Revisar mensajes no leídos.<br>Puede usar los filtros para ayudarle a lidiar con los mensajes entrantes. Vaya a Preferencias > Filtros";
        CRITICAL_WARNING = "Tu buzón está casi lleno.";
        CLICK_ON_TAB = "Haga clic en la pestaña Zimcleaner para saber más.";
        TAG_NOTIFICATION = "Elementos etiquetados satisfactoriamente. Preparando descarga...";
        SUGGESTIONS_TITLE = "Sugerencias";
        TRASH_WARNING = "Los mensajes en tu papelera ocupan demasiado espacio";
        SHOW_MESSAGES_BUTTON = "Mostrar (mensajes)";
        SHOW_BRIEFCASE_BUTTON = "Mostrar (maletín)";
        SPAM_WARNING = "Tus mensajes de correo no deseado (spam) ocupan demasiado espacio";
        DRAFT_WARNING = "Tus borradores ocupan demasiado espacio";
        BRIEFCASE_WARNING = "Tu maletín ocupa demasiado espacio.";
        USER_QUOTA_TITLE = "Cuota de usuario";
        OF = "de";
        SPACE_USAGE = "espacio usado";
        USED_SPACE_DETAILS = "Detalles del espacio utilizado";
        CLIC_TO_SEE_MORE_LABEL = "Haga clic en un elemento para ver más detalles";
        INBOX = "Bandeja de entrada";
        TRASH = "Papelera";
        DRAFTS = "Borradores";
        SENT = "Enviados";
        SPAM = "Spam";
        BRIEFCASE = "Maletín";
        OTHER = "Otros";
        RELOAD_BUTTON = "Volver a ejecutar análisis";
        DONATE_INFO = "Encontraste útil este software?";
        // dialogos
        CLEAN_TRASH_CONFIRM = "Todos los contenidos de la papelera, includos los correos, contactos, eventos de calendario y documentos del maletín serán eliminados. ¿Desea continuar?";
        CLEAN_SPAM_CONFIRM = "Todos los contenidos de la carpeta de Correo no deseado serán eliminados. ¿Desea continuar?";
        CLEAN_DRAFTS_CONFIRM = "This will remove the drafts folder contents. Are you sure to continue?";
        // tags
        HEAVIEST_MESSAGES_TAG = "mensajes-pesados-";
        OLDEST_MESSAGES_TAG = "mensajes-antiguos-";
        // button titles
        SHOW_HEAVIEST_TITLE = "Mostrar mensajes ordenados por tamaño";
        SHOW_OLDEST_TITLE = "Mostrar mensajes antiguos, ordenados por fecha";
    }
}
